exports.Msg = function(uid,data)
{
  this.m_uid = uid;
  this.m_cmdID =  data.readInt32LE(0);

  switch(cmdID)
  {
    case 1: //LoginMsg
      break;
    case 2: //UpdatePosition
      this.DecodeUpdatePositionVelocity(data.slice(4));
      break;
    case 3: //Fire
      this.DecodeFire(data.slice(4));
      break;
  }
}

exports.Msg.prototype.DecodeUpdatePositionVelocity = function(data)
{
  this.m_pos = {};
  this.m_velocity = {};
  this.m_eulerAngle = {};
  
  var index = 0;
  this.m_id = data.readInt32LE(index);
  index+=4;

  this.m_pos.x = data.readFloatLE(index);
  index += 4;
  this.m_pos.y = data.readFloatLE(index);
  index += 4;
  this.m_pos.z = data.readFloatLE(index);
  index += 4;
  
  this.m_velocity.x = data.readFloatLE(index);
  index += 4;
  this.m_velocity.y = data.readFloatLE(index);
  index += 4;
  this.m_velocity.z = data.readFloatLE(index);
  index += 4;

  this.m_eulerAngle.x = data.readFloatLE(index);
  index += 4;
  this.m_eulerAngle.y = data.readFloatLE(index);
  index += 4;   
  this.m_eulerAngle.z = data.readFloatLE(index);
  index += 4;

}

exports.Msg.prototype.DecodeFire = function(data)
{
  this.m_id = data.readInt32LE(index);
  index += 4;

  this.m_fireBuffer = data.slice(index);
}

exports.Msg.prototype.DecodeTank = function(data)
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

exports.Msg.prototype.EncodeTank = function (tank_model)
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


