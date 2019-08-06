var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');


var productos = require('../models/productos');


/* GET home page. */

router.get('/', async (req, res) => {
  var catalogos = await productos.find();
  console.log(catalogos);
  res.render('pages/prueba', { title: 'Productos', catalogos });
});

router.get('/form', function (req, res, next) {
  res.render('pages/index', { title: 'Kike' });
});

router.post('/crear', multipartMiddleware, async (req, res) => {
  console.log(req.body, req.files);

  var tmp_path = req.files.imagen.path;
  var name = req.files.imagen.name;
  var ext = (name.substring(name.lastIndexOf("."))).toLowerCase();
  var fechaEnMiliseg = Date.now();
  name = fechaEnMiliseg + ext;

  var target_path = './public/images/' + name;


  var is = fs.createReadStream(tmp_path);
  var os = fs.createWriteStream(target_path);

  is.pipe(os);
  is.on('end', function () {
    fs.unlinkSync(tmp_path);
    var data = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      imagenUrl: name,
      precio: req.body.precio,
      genero: req.body.genero

    }
    var producto = new productos(data);
    producto.save().then(() => res.redirect('/'));
  });





});

router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await productos.remove({ _id: id });
  res.redirect('/prueba');
});

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;
  var catalogos = await productos.findById(id);
  var seletvalue = { opci: catalogos.genero }

  if (seletvalue.opci == 0) {
    seletvalue.selectHombre = true;
  } else if (seletvalue.opci == 1) {
    seletvalue.selectMujer = true;
  }

  console.log(seletvalue);

  res.render('pages/update', { catalogos, seletvalue });
});

router.post('/update/:id', multipartMiddleware, async (req, res) => {
  const { id } = req.params;

  var name1 = req.files.imagen.name;
  if (name1 != "") {
    var tmp_path = req.files.imagen.path;
    var name = req.files.imagen.name;
    var ext = (name.substring(name.lastIndexOf("."))).toLowerCase();
    var fechaEnMiliseg = Date.now();
    name = fechaEnMiliseg + ext;

    var target_path = './public/images/' + name;
    var is = fs.createReadStream(tmp_path);
    var os = fs.createWriteStream(target_path);

    is.pipe(os);
    is.on('end', function () {
      fs.unlinkSync(tmp_path);
      var data = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagenUrl: name,
        precio: req.body.precio,
        genero: req.body.genero

      }
      productos.findByIdAndUpdate(id, data, { new: true }, (err, productos) => {
        if (err) return res.status(500).send(err);
        return res.redirect('/update/' + id);
      })
    })

  } else {

    productos.findByIdAndUpdate(id, req.body, { new: true }, (err, productos) => {
      if (err) return res.status(500).send(err);
      return res.redirect('/update/' + id);
    })
  }

});


module.exports = router;
