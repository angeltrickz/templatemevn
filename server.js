var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var ss = require('socket.io-stream');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');


var mongoDB = 'mongodb://testuser:123456x@ds145871.mlab.com:45871/templatetest';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
var ObjectId = require('mongodb').ObjectID;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use('/img',express.static(__dirname + '/public'));
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/scss',express.static(__dirname + '/public/scss'));
app.use('/vendor',express.static(__dirname + '/public/vendor'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/assets',express.static(__dirname + '/public/assets'));
app.use('/img',express.static(__dirname + '/public/img'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
});

app.get('/pagina2',function(req,res){
    res.sendFile(__dirname+'/public/pagina2.html');
});



server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


var DemoSchema = mongoose.Schema({
 
  titulo: String,
  contenido:String
});

var demodocumento = mongoose.model('testDB', DemoSchema);



io.on('connection',function(socket){

  console.log("usuario conectado");


  io.emit('Bienvenida', "Bienvenido escribe algo");

 demodocumento.find({}, function(err,registros){

         io.emit('respuestaDB', registros);

      });

  socket.on('mensaje',function(data){

    socket.emit('respuesta',data);

    });

  socket.on('guardarDB',function(data){

    var registro = new demodocumento({
   
    titulo: data.mensaje,
    contenido:"mensaje del cliente"

   });


  registro.save(function (err, elemento) {

          if (err) return console.error(err);

          demodocumento.find({}, function(err,registros){

             socket.emit('respuestaDB', registros);

          });
              console.log("comentario guardado: "+elemento._id)
           
        });

    
    });


        

  socket.on('borrarDB',function(data){

     demodocumento.findByIdAndRemove(data.id, function (err,offer){
      if(err){ console.log(err)
      }else{
        console.log("comentario borrado");

      }

         });

    });
     
         

    
});
