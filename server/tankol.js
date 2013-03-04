var net = require('net');
var PORT = 80;
var gamelogic = require('./gamelogic.js');


var star_index = end_index = 0;

var client_list = {};
//var id_sock = [];

gamelogic.init(send_to_client,broadcastOthers,broadcastAll);

function on_data(socket,data)
{
	//console.log('received from: ' + socket.remoteAddress + ':' +  socket.remotePort);
	//console.log(data);

  var key = socket.remoteAddress+':'+socket.remotePort;
  var client = client_list[key];
  if(client == null)
  {
    console.log('err, client not found:' + key);
    return;
  }

  if(client.buffer == null)
  {
    client.buffer = data;
  }else{
    client.buffer = Buffer.concat([client.buffer,data]);
  }

  
  while(client.buffer != null)
  {
    var buf = client.buffer;
    var len = buf.readInt32LE(0);
    if(len > buf.length)
    {
      //for more stream code
      break;
    }
    var msg = new Buffer(len - 4); 
    buf.copy(msg,0,4,len);

    //onmsg
    gamelogic.send_to_client = send_to_client;
    gamelogic.onMsg(socket,msg,send_to_client);

    if(len == buf.length)
    {
      client.buffer = null;
    }else{
      var temp = new Buffer(buf.length - len);
      buf.copy(temp,0,len,buf.length);
      client.buffer = temp;
    }
    
  }

}

function on_close(socket,data)
{
  gamelogic.onClose(socket,data);
}

function send_to_client(socket,data)
{
  var buff = new Buffer(4+data.length);
  buff.writeInt32LE(4+data.length,0);
  data.copy(buff,4);
  socket.write(buff);
  //console.log('write ' + (4+ data.length ) + ' bytes to client');
  //console.log(buff);
}

function broadcastOthers(socket,data)
{
  var buff = new Buffer(4+data.length);
  var key = socket.remoteAddress+':'+socket.remotePort;
  buff.writeInt32LE(4+data.length,0);
  data.copy(buff,4);
  console.log('in broadcastOthers, key=',key);
  for (var index in client_list){
       if(key != index){
        if(client_list[index].socket != null){
          //console.log('in broadcastOthers,send to ' + index);
          //console.log(buff);
          client_list[index].socket.write(buff);
        }
      }   
  }
}

function broadcastAll(data)
{
  var buff = new Buffer(4+data.length);
  buff.writeInt32LE(4+data.length,0);
  data.copy(buff,4);
  //console.dir(client_list);
  for(var index in client_list){
      //console.log(index);
      if(client_list[index].socket!=null){
        //console.log('in broadcastAll,send to ' + index);
        //console.log(buff);
        client_list[index].socket.write(buff);
      }
  }
}

net.createServer(function(socket){
  console.log('got a request' + socket.remoteAddress + ':' +  socket.remotePort);
  
  var key = socket.remoteAddress+':'+socket.remotePort;
  client_list[key] = {};

  var client = client_list[key];

  client.socket = socket;
  client.buffer = null;

  socket.on('data',function(data){
    on_data(socket,data);
  });
  
  socket.on('close',function(data){
    console.log('closed: ' + key) ;
    delete client_list[key];
    on_close(key,data);
  });

}).listen(80,'0.0.0.0');


setInterval(gamelogic.onTimer,5000);

