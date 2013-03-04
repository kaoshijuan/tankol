

var tanks = [];

function decodeTank(data)
{
  var tank_model = {};
  var offset = 0;
  tank_model.m_id = data.readInt32LE(offset);
  offset += 4;
  tank_model.m_pos.x = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_pos.y = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_pos.z = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_velocity.x = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_velocity.y = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_velocity.z = data.readFloatLE(offset);
  offset += 4;

  tank_model.m_eulerAngle.x = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_eulerAngle.y = data.readFloatLE(offset);
  offset += 4;
  tank_model.m_eulerAngle.z = data.readFloatLE(offset);
  offset += 4;

  tank_model.m_iLevel = data.readInt32LE(offset);
  offset += 4;
  tank_model.m_iReserve1 = data.readInt32LE(offset);
  offset += 4;
  tank_model.m_iReserve2 = data.readInt32LE(offset);
  offset += 4;
  tank_model.m_iReserve3 = data.readInt32LE(offset);
  offset += 4;  
  tank_model.m_iReserve4 = data.readInt32LE(offset);
  offset += 4;

  return tank_model;  
}

function encodeTank(tank_model)
{
  var data = new Buffer(60);
  var offset = 0;
  data.writeInt32LE(tank_model.m_id,offset);
  offset += 4;

  data.writeFloatLE(tank_model.m_pos.x,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_pos.y,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_pos.z,offset);
  offset += 4;

  data.writeFloatLE(tank_model.m_velocity.x,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_velocity.y,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_velocity.z,offset);
  offset += 4;

  data.writeFloatLE(tank_model.m_eulerAngle.x,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_eulerAngle.y,offset);
  offset += 4;
  data.writeFloatLE(tank_model.m_eulerAngle.z,offset);
  offset += 4;

  data.writeInt32LE(tank_model.m_iLevel,offset);
  offset += 4;
  
  data.writeInt32LE(tank_model.m_iReserve1,offset);
  offset += 4;
  data.writeInt32LE(tank_model.m_iReserve2,offset);
  offset += 4;
  data.writeInt32LE(tank_model.m_iReserve3,offset);
  offset += 4;
  data.writeInt32LE(tank_model.m_iReserve4,offset);
  offset += 4;

  return data;
}

function GetID()
{
  var i = 0;
  for(i=0;i < tanks.length; ++i)
  {
      if (tanks[i] == null)
      {
        break;
      }
  }

  return i;

}

function createTankRandom()
{
  
  var model = {
    m_id : 0,
    m_pos: {
      x:0,
      y:0,
      z:0,
    },
    m_velocity: {
      x:0,
      y:0,
      z:0,
    },
    m_eulerAngle: {
      x:0,
      y:0,
      z:0,
    },
    m_iLevel:0,
    m_iReserve1:0,
    m_iReserve2:0,
    m_iReserve3:0,
    m_iReserve4:0
  };

  model.m_id = GetID();
  model.m_pos.x = Math.random() * 100 + 50;
  model.m_pos.y = 2;//Math.random() * 1;
  model.m_pos.z = Math.random() * 100 + 50;

  model.m_velocity.x = model.m_velocity.y = model.m_velocity.z = 0;

  model.m_eulerAngle.x = model.m_eulerAngle.z = 0;
  model.m_eulerAngle.y = Math.random() * 360;

  //var data = encodeTank(model);
  var tank = {};
  tank.data = null;
  tank.model = model;

  return tank;
}

var send_to_client = function(){};
var broadcastOthers = function(){};
var broadcastAll = function(){};

exports.init = function(send_to_client_func,broadcastOthers_func,broadcastAll_func){
  send_to_client = send_to_client_func;
  broadcastOthers = broadcastOthers_func;
  broadcastAll = broadcastAll_func;
}

exports.onClose = function(key,data)
{
  console.log('now remove '+key);
  for (var l in tanks)
  {
    if(tanks[l] == null)
    {
      continue;
    }
    if(tanks[l].sock_key == key)
    {
      console.log('remove tank '+ l + ' from ' +  key);
      //tanks.splice(l);
      tanks[l] = null;
    }
  }
}

exports.onMsg = function(socket,data)
{
  var key = socket.remoteAddress+':'+socket.remotePort;

  var cmd = data.readInt32LE(0);
  var msg = data.slice(4,data.length);

  switch(cmd)
  {
    case 1:
      onLogin(socket,msg);
      break;
    case 2:
      onUpdatePosVelocity(socket,msg);
      break;
    case 3:
      onFireRequest(socket,msg);  
      break;
    default:
      break;
  }  
}


function sendMsg (socket,cmd,data)
{
  var temp = new Buffer(4);
  temp.writeInt32LE(cmd,0);
  send_to_client(socket,Buffer.concat([temp,data]));
}


function onFireRequest(socket,data)
{
  var id = data.readInt32LE(0);
  console.log(id + ' fired,broadcast it');
  var response_data = new Buffer(4);
  response_data.writeInt32LE(103,0);
  broadcastOthers(socket,Buffer.concat([response_data,data]));
}

function onLogin(socket,data)
{

  var key = socket.remoteAddress+':'+socket.remotePort;
  console.log('login from '+key);
  var tank = createTankRandom();
  tank.sock_key = key; 
  tanks[tank.model.m_id] = tank;

//just for test
  /*var tank2 = createTankRandom();
  tank2.model.m_pos.x = tank.model.m_pos.x;
  tank2.model.m_pos.y = tank.model.m_pos.y;
  tank2.model.m_pos.z = tank.model.m_pos.z + 20;

  tank2.model.m_eulerAngle.x = tank.model.m_eulerAngle.x;
  tank2.model.m_eulerAngle.y = tank.model.m_eulerAngle.y;
  tank2.model.m_eulerAngle.z = tank.model.m_eulerAngle.z;
  tanks[tank2.model.m_id] = tank2;
*/
  var count = 0;
  for(var j = 0; j < tanks.length; ++j)
  {
    if(tanks[j] != null)
    {
      ++count;
    }
  }

  var response_data = new Buffer(8);
  response_data.writeInt32LE(tank.model.m_id,0);
  response_data.writeInt32LE(count,4);
  for(var i = 0; i < tanks.length;i++)
  {
    if(tanks[i] != null)
    {
      var temp = encodeTank(tanks[i].model);
      response_data = Buffer.concat([response_data,temp]);
    }
  }

  console.log('in onLogin,send '+ tanks.length +' tanks to client');
  sendMsg(socket,101,response_data);

}


function onUpdatePosVelocity(socket,data)
{
  var index = 0;
  var id = data.readInt32LE(index);
  index +=4;
  if(tanks[id])
  { 
    tanks[id].model.m_pos.x = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_pos.y = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_pos.z = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_velocity.x = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_velocity.y = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_velocity.z = data.readFloatLE(index);
    index += 4;

    tanks[id].model.m_eulerAngle.x = data.readFloatLE(index);
    index += 4;
    tanks[id].model.m_eulerAngle.y = data.readFloatLE(index);
    index += 4;   
    tanks[id].model.m_eulerAngle.z = data.readFloatLE(index);
    index += 4;
  }
}


function onHit  (socket,data)
{

}

function onExit  (socket,data)
{

}

exports.onTimer = function()
{

  var count = 0;
  for(var j = 0; j < tanks.length; ++j)
  {
    if(tanks[j] != null)
    {
      ++count;
    }
  }

  if (count == 0) 
  {
    return;
  }

  var response_data = new Buffer(8);
  response_data.writeInt32LE(102,0);
  response_data.writeInt32LE(count,4);
  for(var i = 0; i < tanks.length;i++)
  {
    if(tanks[i] != null)
    {
      var temp = encodeTank(tanks[i].model);
      response_data = Buffer.concat([response_data,temp]);
    }
  }
  
  broadcastAll(response_data);
}



