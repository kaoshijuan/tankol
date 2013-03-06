exports.CLientManager = function()
{
  this.playerList = {};
}

exports.CLientManager.prototype.OnConnect = function (socket)
{
  var key  = socket.remoteAddress+':'+socket.remotePort;
  this.playerList[key] = {};
  this.playerList[key].id = 0;
  this.playerList[key].socket = socket;
}

exports.CLientManager.prototype.OnClose = function (socket)
{
  var key  = socket.remoteAddress+':'+socket.remotePort;

  delete this.playerList[key];

}

exports.CLientManager.prototype.OnData = function(socket,data)
{
  var key  = socket.remoteAddress+':'+socket.remotePort;
  
}


