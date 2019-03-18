

socket = io.connect();

var app = new Vue({
  el: '#app',
  data: {
    
    titulo1: 'la respuesta del servidor es :',
    respuesta: '',
    input: '',
    datos:[],

    
  },
  methods: {
    onEnter: function() {
      var text = this.input;
      socket.emit('mensaje',{mensaje:text});
      
    },
    onGuardar: function() {
      var text = this.input;
     socket.emit('guardarDB',{mensaje:text});
    },
    onBorrar: function(id) {
      socket.emit('borrarDB',{id:id});
    }
  },
  computed: {
    // un getter computado
    reversedatos: function () {
      // `this` apunta a la instancia de vm
      return this.datos.slice().reverse();
    }
  }
});




socket.on('Bienvenida',function(data){
    app.respuesta = data;

  });

socket.on('respuesta',function(data){
    
    app.respuesta = data.mensaje;
    app.input = "";

  });

socket.on('respuestaDB',function(data){
    
    app.datos = data;
    console.log(data)
  });

