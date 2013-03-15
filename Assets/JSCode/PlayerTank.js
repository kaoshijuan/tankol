#pragma strict

var MoveSpeed:int;
var RotateSpeed:int;
var Energy:int=100;

var FirePoint:Transform;
var Bullet:Rigidbody;
var BulletSpeed:int;
var FireAudioObj:GameObject;
var HitAudioObj:GameObject;

public var m_uid = '';
private var lastCheck = 0;
public var m_sName = "";
public var m_iShootCount = 0;

function Start () {
	Energy=10;
	
	//smooth look at
	var theCamera = GameObject.Find('Main Camera');
	if(theCamera)
	{
		var smoothFollow :SmoothFollow = theCamera.GetComponent('SmoothFollow') as SmoothFollow;
		smoothFollow.target = this.transform;
	}
}

function Init(tankmodel:TankModel) {
	this.transform.eulerAngles = tankmodel.m_eulerAngle;
	this.transform.rigidbody.velocity = tankmodel.m_velocity;
	this.m_uid = tankmodel.m_uid;
	this.m_sName = tankmodel.m_name;
	this.m_iShootCount = tankmodel.m_iShootCount;
}

function Update () {
	var v = this.rigidbody.velocity;
	var smoke = GameObject.Find("MyTankSmoke");
	if(Energy <= 0)
	{
		smoke.particleEmitter.Emit();
		return;
	}
	
	if(Input.GetKey(KeyCode.W))
	{
		
		//print(v);
		if( Mathf.Abs(v.x) < MoveSpeed && Mathf.Abs(v.y) < MoveSpeed && Mathf.Abs(v.z) < MoveSpeed)
			this.rigidbody.velocity += this.rigidbody.transform.forward*1.5;
		
		smoke = GameObject.Find("MyTankSmoke");
		if(smoke != null)
		{
			smoke.particleEmitter.Emit();
		}
		
		UpdatePosVelocity();
		
	}
	if(Input.GetKey(KeyCode.S))
	{
		v = this.rigidbody.velocity;
		if(Mathf.Abs(v.x) < MoveSpeed && Mathf.Abs(v.y) < MoveSpeed && Mathf.Abs(v.z) < MoveSpeed)
			this.rigidbody.velocity -= this.rigidbody.transform.forward*1.5;
			
		smoke = GameObject.Find("TankSmoke");
		if(smoke != null)
		{
			smoke.particleEmitter.Emit();
		}
		
		UpdatePosVelocity();	
	}
	
	if(Input.GetKey(KeyCode.A))
	{
		
		this.transform.Rotate(Vector3.down*Time.deltaTime*RotateSpeed);
		UpdatePosVelocity();
		
	}
	if(Input.GetKey(KeyCode.D))
	{
		
		this.transform.Rotate(Vector3.up*Time.deltaTime*RotateSpeed);
		UpdatePosVelocity();
		
	}
	if(Input.GetKeyDown(KeyCode.Space)){
		var newBullet:Rigidbody;
		newBullet = Instantiate(Bullet,FirePoint.position,FirePoint.rotation);
		newBullet.velocity = transform.TransformDirection(Vector3.forward*BulletSpeed);
		var fireAudio:AudioSource = FireAudioObj.GetComponent(AudioSource);
		if (fireAudio != null)
		{
			fireAudio.Play();
		}
		var theCamera = GameObject.Find('Main Camera');
		if(theCamera)
		{
			var smoothFollow :SmoothFollow = theCamera.GetComponent('SmoothFollow') as SmoothFollow;
			//smoothFollow.target = newBullet.transform;
		}
		Fire(newBullet.transform.position,FirePoint.rotation,newBullet.velocity);
	}	
	
	CheckTimer();
}

function OnCollisionEnter(obj:Collision)
{
	//Debug.Log(obj.gameObject.name);
		
	if(obj.gameObject.tag == "BulletEnemy")
	{
		
		var hitAudio:AudioSource = HitAudioObj.GetComponent(AudioSource);
		if (hitAudio != null )
		{
			hitAudio.Play();
		}
	}
	
}

function CheckTimer()
{
	if (Time.realtimeSinceStartup - lastCheck > 1)
	{
		UpdatePosVelocity();
		lastCheck = Time.realtimeSinceStartup;
	}
}

function UpdatePosVelocity()
{
	var netManager:NetManager = GameObject.FindGameObjectWithTag('GameController').GetComponent("NetManager") as NetManager;
	netManager.UpdatePosVelocity(m_uid,this.rigidbody.transform.position,this.rigidbody.transform.eulerAngles,this.rigidbody.velocity);

}

function Fire(pos:Vector3, rotation:Quaternion, speed:Vector3)
{
	var netManager:NetManager = GameObject.FindGameObjectWithTag('GameController').GetComponent("NetManager") as NetManager;
	netManager.Fire(m_uid,pos,rotation,speed);
}

function SetName(name:String)
{
	m_sName = name;
}
