exports.Player = function(uid,sockKey)
{
	this.m_sockKey = sockKey;
	this.m_uid = uid;
	this.m_pos = {};
	this.m_velocity = {};
	this.m_eulerAngle = {};
	this.m_name = '';
}

exports.Player.prototype.Random = function()
{
  this.m_pos.x = Math.random() * 100 + 50;
  this.m_pos.y = 2;//Math.random() * 1;
  this.m_pos.z = Math.random() * 100 + 50;

  this.m_velocity.x = this.m_velocity.y = this.m_velocity.z = 0;

  this.m_eulerAngle.x = this.m_eulerAngle.z = 0;
  this.m_eulerAngle.y = Math.random() * 360;	
}

exports.Player.prototype.FetchData = function()
{
  //fetch data

  this.m_iLevel = 0;
  this.m_iReserve1 = 0;
  this.m_iReserve2 = 0;
  this.m_iReserve3 = 0;
  this.m_iReserve4 = 0;
}

exports.Player.prototype.Update = function(msg)
{
	this.m_pos.x = msg.m_pos.x;
	this.m_pos.y = msg.m_pos.y;
	this.m_pos.z = msg.m_pos.z;

	this.m_velocity.x = msg.m_velocity.x;
	this.m_velocity.y = msg.m_velocity.y;
	this.m_velocity.z = msg.m_velocity.z;
	
	this.m_eulerAngle.x = msg.m_eulerAngle.x;
	this.m_eulerAngle.y = msg.m_eulerAngle.y;
	this.m_eulerAngle.z = msg.m_eulerAngle.z;

}

exports.Player.prototype.Encode = function()
{
	var buffer = new Buffer(4);
	var uidBuffer = new Buffer(this.m_uid);
	buffer.writeInt32LE(uidBuffer.length,0);
	buffer = Buffer.concat([buffer,uidBuffer]);

	var tmp = new Buffer(4);
	
	tmp.writeFloatLE(this.m_pos.x,0);
	buffer = Buffer.concat([buffer,tmp]); 

	tmp.writeFloatLE(this.m_pos.y,0);
	buffer = Buffer.concat([buffer,tmp]); 

	tmp.writeFloatLE(this.m_pos.z,0);
	buffer = Buffer.concat([buffer,tmp]); 

	tmp.writeFloatLE(this.m_velocity.x,0);
	buffer = Buffer.concat([buffer,tmp]); 

	tmp.writeFloatLE(this.m_velocity.y,0);
	buffer = Buffer.concat([buffer,tmp]); 		

	tmp.writeFloatLE(this.m_velocity.z,0);
	buffer = Buffer.concat([buffer,tmp]);

	tmp.writeFloatLE(this.m_eulerAngle.x,0);
	buffer = Buffer.concat([buffer,tmp]);

	tmp.writeFloatLE(this.m_eulerAngle.y,0);
	buffer = Buffer.concat([buffer,tmp]);

	tmp.writeFloatLE(this.m_eulerAngle.z,0);
	buffer = Buffer.concat([buffer,tmp]);


	tmp.writeInt32LE(this.m_iLevel,0);
	buffer = Buffer.concat([buffer,tmp]);	

	tmp.writeInt32LE(this.m_iReserve1,0);
	buffer = Buffer.concat([buffer,tmp]);	

	tmp.writeInt32LE(this.m_iReserve2,0);
	buffer = Buffer.concat([buffer,tmp]);	

	tmp.writeInt32LE(this.m_iReserve3,0);
	buffer = Buffer.concat([buffer,tmp]);	

	tmp.writeInt32LE(this.m_iReserve4,0);
	buffer = Buffer.concat([buffer,tmp]);	
	

	tmp = new Buffer(this.m_name);

	var buffLen = new Buffer(4);
	buffLen.writeInt32LE(tmp.length,0);

	buffer = Buffer.concat([buffer,buffLen]);
	buffer = Buffer.concat([buffer,tmp]);

	return buffer;	
}

