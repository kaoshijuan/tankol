exports.Msg =  function(data)
{
  if(data == null){
    //encode
  }else{
  	//decode
    return JSON.parse(data.toString('utf-8'));
  }

}

exports.Msg.prototype.Encode = function ()
{
  return new Buffer(JSON.stringify(this),'utf-8');
}

