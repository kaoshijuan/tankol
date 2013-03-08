var GameLogic = require('./gamelogic.js').GameLogic;
var Msg = require('./protocol.js').Msg;

var gameLogic = new GameLogic();

function OnTimer(){
	gameLogic.OnTimer.call(gameLogic);
}
setInterval(OnTimer,200);

exports.ClientManager = function()
{
	this.socketList = {};


	gameLogic.m_clientMananger = this;
}

exports.ClientManager.prototype.OnConnect = function (socket)
{
	var key  = socket.remoteAddress+':'+socket.remotePort;
	this.socketList[key] = {};
	this.socketList[key].socket = socket;
	this.socketList[key].buffer = null;
}

exports.ClientManager.prototype.OnClose = function (socket)
{
	var key  = socket._peername.address+':'+socket._peername.port;

	delete this.socketList[key];
	

}

exports.ClientManager.prototype.OnData = function(socket,data)
{

	var key = socket.remoteAddress+':'+socket.remotePort;
	if(this.socketList[key] == null)
	{
		console.log(key + ' not found on server');
		return;
	}

	var client = this.socketList[key];
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
		var msg = new Msg(new_buf);
		
		msg.m_sockKey = key;
		gameLogic.OnMsg(msg);
		var uid = msg.m_uid;

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


exports.ClientManager.prototype.SendData = function (msg)
{
	var sockKey = msg.m_sockKey;
	if(this.socketList[sockKey])
	{
		var socket = this.socketList[sockKey].socket;
		if(socket)
		{
			var data = msg.Encode();
			var buff = new Buffer(4);
			buff.writeInt32LE(data.length+4,0);
			socket.write(Buffer.concat([buff,data]));
		}
	}

}

