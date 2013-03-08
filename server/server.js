var net = require('net');
var PORT = 80;

var CM = require('./clientmanager.js').ClientManager;
var client_manager =  new CM();


net.createServer(function(socket){
  
  client_manager.OnConnect(socket);

  socket.on('data',function(data){
    client_manager.OnData(socket,data);
  });
  
  socket.on('close',function(data){
    client_manager.OnClose(socket);
  });
  socket.on('error',function(data){
    console.log('unhandle error '+ data);
  });
}).listen(80,'0.0.0.0');


