#pragma strict


var lastCheck = 0;

var FirePoint:Transform;
var Bullet:Rigidbody;
var m_uid = '';
private var m_sName = "";
private var lastUpdateTime = 0;

function OnCollisionEnter(obj:Collision)
{
		
	if(obj.gameObject.tag == "Bullet")
	{
		DestroyNow();
	}
}


function DestroyNow ()
{
	DestroyObject (gameObject);
	
}

function Init(tankmodel:TankModel)
{
	this.transform.eulerAngles = tankmodel.m_eulerAngle;
	this.transform.rigidbody.velocity = tankmodel.m_velocity;
	this.m_uid = tankmodel.m_uid;
}

function Start()
{
	lastUpdateTime = Time.realtimeSinceStartup;
}

function Update()
{

	CheckTimer();
}

function CheckTimer()
{
	if (Time.realtimeSinceStartup - lastCheck > 2)
	{
		lastCheck = Time.realtimeSinceStartup;
	}
	
	if(Time.realtimeSinceStartup - lastUpdateTime > 3 )
	{//3秒没更新数据，清呆
		DestroyNow();
	}
}

function UpdateStatus(tankmodel:TankModel)
{
	lastUpdateTime = Time.realtimeSinceStartup;
	
	this.transform.eulerAngles = tankmodel.m_eulerAngle;
	this.rigidbody.velocity.x = (tankmodel.m_pos.x - this.rigidbody.position.x)/0.5;
	this.rigidbody.velocity.y = (tankmodel.m_pos.y - this.rigidbody.position.y)/0.5;
	this.rigidbody.velocity.z = (tankmodel.m_pos.z - this.rigidbody.position.z)/0.5;
}

function SetName(name:String)
{
	m_sName = name;
}