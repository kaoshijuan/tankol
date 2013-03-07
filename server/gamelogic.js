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
    this.player.m_sockKey = msg.m_sockKey;
  }

  player.FetchData();

  var responseMsg = new Msg();
  responseMsg.m_uid = uid;
  responseMsg.m_sockKey = player.m_sockKey;
  responseMsg.m_cmdID = 101;
  responseMsg.m_playerList = this.GetPlayerListData();
  this.m_clientMananger.SendData(responseMsg);
}

exports.GameLogic.prototype.GetPlayerListData = function()
{
  var data = {};
  for (var l in this.m_playerList)
  {
    // to be done
  }
}

exports.GameLogic.prototype.ProcessUpdatePositionVelocity = function(msg)
{
  var uid = msg.m_uid;
  var player = this.FindPlayerByUid(uid);
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
  for (var player in this.m_playerList)
  {
    if(player.m_uid != uid)
    {
      msg.m_cmdID = 103;
      msg.m_sockKey = player.sockKey;
      this.m_clientMananger.SendData(msg);
    }
  }
}



exports.GameLogic.prototype.onTimer = function()
{
  var msg = new Msg();
  msg.m_cmdID = 102;
  msg.m_playerList = this.m_playerList;
  for (var player in this.m_playerList)
  {
      msg.m_sockKey = player.sockKey;
      this.m_clientMananger.SendData(msg);
  }   
}



