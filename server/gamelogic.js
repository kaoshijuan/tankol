var Player = require('./player.js').Player;
var Msg = require('./protocol.js').Msg;

exports.GameLogic = function()
{
  this.m_playerList = {};
}

exports.GameLogic.prototype.OnMsg = function (msg)
{
  var cmdID = msg.m_cmdID;
  switch(cmdID)
  {
    case 1:
      this.ProcessOnLogin(msg);
      break;
    case 2:
      this.ProcessUpdatePositionVelocity(msg);
      break;
    case 3:
      this.ProcessFire(msg);
      break;
    case 5:
      this.ProcessExit(msg);
  }
}

exports.GameLogic.prototype.ProcessExit = function(msg)
{
  var uid = msg.m_uid;
  if(this.m_playerList[uid])
  {
    console.log('remove user: ' + uid);
    delete this.m_playerList[uid];
  }
}

exports.GameLogic.prototype.ProcessOnLogin = function(msg)
{
  var uid = msg.m_uid;
  var player = this.FindPlayerByUid(uid);
  if(player == null)
  {
    player = this.CreatePlayer(uid,msg.m_sockKey);
  }else{
    //multi login...
    player.m_sockKey = msg.m_sockKey;
  }

  player.FetchData();
  player.m_name = msg.m_name;

  var responseMsg = new Msg();
  responseMsg.m_uid = uid;
  responseMsg.m_sockKey = player.m_sockKey;
  responseMsg.m_cmdID = 101;
  responseMsg.m_playerList = this.GetPlayerListData();
  this.m_clientMananger.SendData(responseMsg);
}

exports.GameLogic.prototype.GetPlayerListData = function()
{
  return this.m_playerList;
}


exports.GameLogic.prototype.FindPlayerByUid = function(uid)
{
  return this.m_playerList[uid.toString()];
}

exports.GameLogic.prototype.CreatePlayer = function(uid,sockKey)
{
  var player = new Player(uid,sockKey);
  player.Random();
  this.m_playerList[uid.toString()] = player;

  return player;

}

exports.GameLogic.prototype.ProcessUpdatePositionVelocity = function(msg)
{
  var uid = msg.m_uid;
  var player = this.FindPlayerByUid(uid);
  if(player !== null && player !== undefined)
  {
    player.Update(msg);
  }
}

exports.GameLogic.prototype.ProcessFire = function (msg)
{
  var uid = msg.m_uid;
  for (var l in this.m_playerList)
  {
    var player = this.m_playerList[l];
    if(player && player.m_uid != uid)
    {
      msg.m_cmdID = 103;
      msg.m_sockKey = player.m_sockKey;
      this.m_clientMananger.SendData(msg);
    }
  }
}



exports.GameLogic.prototype.OnTimer = function()
{
  var msg = new Msg();
  msg.m_cmdID = 102;
  msg.m_playerList = this.m_playerList;
  for (var l in this.m_playerList)
  {
      var player = this.m_playerList[l];
      if(player)
      {
        msg.m_sockKey = player.m_sockKey;
        this.m_clientMananger.SendData(msg);
      }
  }   
}



