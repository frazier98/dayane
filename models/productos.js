var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var Schema= new Schema({

 nombre:{type:String},
 descripcion:{type:String},
 imagenUrl:{type:String},
 precio:{type:String},
 genero:{type:String}
});
module.exports=mongoose.model('catalogo',Schema);