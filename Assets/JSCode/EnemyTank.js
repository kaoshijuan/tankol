#pragma strict


var lastCheck = 0;

var FirePoint:Transform;
var Bullet:Rigidbody;
var m_id = 0;
function OnCollisionEnter(obj:Collision)
{
	//Debug.Log(obj.gameObject.name);
		
	if(obj.gameObject.tag == "Bullet")
	{
		
/*		var t:float = Random.Range(0.0,1.0);
		if(t>0.7 || status == 1 )
		{//dead
			Invoke("DestroyNow",0.2);
			Destruct(this.gameObject);
		}else{
			status = 1;
						
		}
*/
		DestroyNow();
	}
}


function DestroyNow ()
{
	DestroyObject (gameObject);
	
}

function Start()
{
	
}

function Update()
{


}

function CheckTimer()
{
	if (Time.realtimeSinceStartup - lastCheck > 2)
	{
		

		lastCheck = Time.realtimeSinceStartup;
	}
}