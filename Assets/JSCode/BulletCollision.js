#pragma strict
var theExplosionFire:GameObject;

function OnCollisionEnter(obj:Collision)
{
	
	Destroy(this.gameObject);
	if(theExplosionFire != null)
	{
		var newExplosion = Instantiate(theExplosionFire,this.gameObject.transform.position,this.gameObject.transform.rotation);
	}
	
	if(obj.gameObject.tag == "Tree")
	{
		Destroy(obj.gameObject);
	}
}

function Update()
{
	if(this.transform.position .y < -100)
	{
		Destroy(this.gameObject);
	}
}