#pragma strict

var target:int;  //0 for you, 1 for your home
var status:int; //0 for good , 1 for wonded
var lastshoot=0;
var lastrotate=0;
var lastCheck = 0;

var FirePoint:Transform;
var Bullet:Rigidbody;
var Speed:int;
var shootgap:int;
function OnCollisionEnter(obj:Collision)
{
	//Debug.Log(obj.gameObject.name);
		
	if(obj.gameObject.tag == "Bullet")
	{
		
		var t:float = Random.Range(0.0,1.0);
		if(t>0.7 || status == 1 )
		{//dead
			Invoke("DestroyNow",0.2);
			Destruct(this.gameObject);
		}else{
			status = 1;
					
		}
	}else if(obj.gameObject.tag == "BulletEnemy"){
		status = 1;
	}
}

function Destruct(obj:GameObject)
{
/*	for (var t:Transform in obj.transform)
	{
		if (t.GetChildCount() > 0)
		{
			Destruct(t.gameObject);
		}else{
			var r:Rigidbody = t.GetComponent(Rigidbody);
			r.velocity.x = 2;
		}
	} */
}

function DestroyNow ()
{
	DestroyObject (gameObject);
}

function Start()
{
	status = 0;
	var t:float = Random.Range(-1,1);
	if(t<0.75)
		target = 0;
	else
		target = 1;
	
	shootgap=Random.Range(5,15);
}

function Update()
{

	CheckTimer();
	var myTank = GameObject.Find("MyTank");
	var home = GameObject.Find("home");
	//Random Run
	if(status == 0 && this.transform.position.y < 5 && this.transform.up == Vector3.up)
	{
		this.rigidbody.velocity = this.rigidbody.transform.forward *Random.Range(-9,-10);
		var vec:Vector3;
		if(target == 0)
		{
			if(myTank != null)
			{
				if(Time.realtimeSinceStartup - lastrotate > Random.Range(1,5))
				{
					vec = myTank.transform.position - this.gameObject .transform.position ;
				
					vec.Normalize ();
					
					//Vector3 tempDir = Vector3.Cross(transform.forward,vec.normalized);
					var tempDir:Vector3 = Vector3.Cross(transform.forward,vec.normalized);
					var dotValue:float =Vector3.Dot(transform.forward,vec.normalized);
					var angle:float =Mathf.Acos(dotValue)*Mathf.Rad2Deg;	
					
					if(tempDir.y < 0)
					{
						angle = angle * (-1);
					}
					this.transform.Rotate(Vector3.up * (angle+180+Random.Range(-5,5)));
					
					lastrotate = Time.realtimeSinceStartup;
					
				}
			}
		}else{
			if(home != null)
			{
				if(Time.realtimeSinceStartup - lastrotate > 10)
				{
					vec = home.transform.position - this.gameObject .transform.position ;
				
					vec.Normalize ();
					
					//Vector3 tempDir = Vector3.Cross(transform.forward,vec.normalized);
					tempDir = Vector3.Cross(transform.forward,vec.normalized);
					dotValue =Vector3.Dot(transform.forward,vec.normalized);
					angle =Mathf.Acos(dotValue)*Mathf.Rad2Deg;	
					if(tempDir.y < 0)
					{
						angle = angle * (-1);
					}
							
					this.transform.Rotate(Vector3.up * (angle+180+Random.Range (-1,1)));
					//this.rigidbody.velocity = this.rigidbody.transform.forward *Random.Range(-4,-5);
					lastrotate = Time.realtimeSinceStartup;
					
				}			
			}
		}
	}
	

	//Random Shoot
	if(Time.realtimeSinceStartup - lastshoot  > shootgap + Random.Range (1,5))
	{
		var newBullet:Rigidbody;
		newBullet = Instantiate(Bullet,FirePoint.position,FirePoint.rotation);
		newBullet.velocity = transform.TransformDirection(Vector3.forward*Speed*-1+Vector3.up *0.2*Random.Range(0,100));
		lastshoot = Time.realtimeSinceStartup ;	
	}
}

function CheckTimer()
{
	if (Time.realtimeSinceStartup - lastCheck > 2)
	{
		
		if (status == 1)
		{
			var smoke = this.transform.Find("EnemySmoke");
			if(smoke != null)
			{
				smoke.particleEmitter.Emit();
			}
		}
		lastCheck = Time.realtimeSinceStartup;
	}
}