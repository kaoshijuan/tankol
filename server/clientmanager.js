var GameLogic = require('./gamelogic.js').GameLogic;
var Msg = require('./protocol.js').Msg;
var gameLogic = new GameLogic();

exports.ClientManager = function()
{
	this.socketList = {};
}

exports.ClientManager.prototype.OnConnect = function (socket)
{
	var key  = socket.remoteAddress+':'+socket.remotePort;
	this.socketList[key].socket = socket;
	this.socketList[key].buffer = null;
}

exports.ClientManager.prototype.OnClose = function (socket)
{
	var key  = socket.remoteAddress+':'+socket.remotePort;

	delete this.playerList[key];

}

exports.ClientManager.prototype.OnData = function(socket,data)
{

	var key = socket.remoteAddress+':'+socket.remotePort;
	if(this.socketList[key] == null)
	{
		console.log(key + ' not found on server');
		return;
	}

	var client = socketList[key];
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

		var new_buf = new Buffer(len - 4); 
		buf.copy(new_buf,0,4,len);

		//onmsg
		var uid  = key;
		var msg = new Msg(key,uid,data);
		gameLogic.OnMsg(msg);

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


