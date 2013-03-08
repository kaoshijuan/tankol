exports.Msg =  function(data)
{
  if(data != null){
    //encode
    this.Decode(data);
  }else{

  }

}

exports.Msg.prototype.Encode = function ()
{
  //return new Buffer(JSON.stringify(this),'utf-8');
  var cmdData = new Buffer(4);
  cmdData.writeInt32LE(this.m_cmdID,0);
  var data;
  switch(this.m_cmdID)
  {
  	case 101:
  		data = this.EncodeBroadCastStatus();
  		break;
  	case 102:
  		data = this.EncodeBroadCastStatus();
  		break;
  	case 103:
  		data = this.EncodeBroadCastFire();
  		break;
  }
  return Buffer.concat([cmdData,data]);
}


exports.Msg.prototype.EncodeBroadCastStatus = function()
{
	var count = 0;
	
	var buffer = new Buffer(4);

	buffer.writeInt32LE(count,0);

	for(var l in this.m_playerList)
	{
		var player = this.m_playerList[l];
		if(player)
		{
			var tmp = player.Encode();
			buffer = Buffer.concat([buffer,tmp]);
			count ++;
		}
	}
	buffer.writeInt32LE(count,0);
	return buffer;

}

exports.Msg.prototype.EncodeBroadCastFire = function()
{
	return this.fireData;
}

exports.Msg.prototype.Decode = function(data)
{
	//get uid first
	var uidLen = data.readInt32LE(0);
	data = data.slice(4);
	this.m_uid = data.toString('utf-8',0,uidLen);
	data = data.slice(uidLen);
	this.m_cmdID = data.readInt32LE(0);
	data = data.slice(4);

	switch(this.m_cmdID)
	{
		case 1:
			this.DecodeLogin(data);
			break;
		case 2:
			this.DecodeUpdatePostion(data);
			break;
		case 3:
			this.DecodeFire(data);
			break;
		case 5:
			this.DecodeExit(data);
	}
}


exports.Msg.prototype.DecodeLogin = function(data)
{
	var nameLen = data.readInt32LE(0);
	data = data.slice(4);
	this.m_name = data.toString('utf-8');
}

exports.Msg.prototype.DecodeExit = function(data)
{

}

exports.Msg.prototype.DecodeUpdatePostion = function(data)
{
	this.m_pos = {};
	this.m_velocity = {};
	this.m_eulerAngle = {};
	this.m_pos.x = data.readFloatLE(0);
	data = data.slice(4);
	this.m_pos.y = data.readFloatLE(0);
	data = data.slice(4);
	this.m_pos.z = data.readFloatLE(0);
	data = data.slice(4);

	this.m_velocity.x = data.readFloatLE(0);
	data = data.slice(4);
	this.m_velocity.y = data.readFloatLE(0);
	data = data.slice(4);
	this.m_velocity.z = data.readFloatLE(0);
	data = data.slice(4);

	this.m_eulerAngle.x = data.readFloatLE(0);
	data = data.slice(4);
	this.m_eulerAngle.y = data.readFloatLE(0);
	data = data.slice(4);
	this.m_eulerAngle.z = data.readFloatLE(0);
	data = data.slice(4);

}

exports.Msg.prototype.DecodeFire = function(data)
{
	this.fireData = data;
}

