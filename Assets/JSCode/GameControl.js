#pragma strict



public var myTank:MyTank;
public var enemyTank:EnemyTank;
public var bullet:Rigidbody;

private var lastCheck = 0;
private var m_id = 0;

function Start () {

	var netManager = GetComponent("NetManager") as NetManager;
	if(netManager.Init()<0)
	{
		Debug.LogError('net mananger init failed');
	}else{
		netManager.Login();
	}
}


function Update () {
	
	var netManager = GetComponent("NetManager") as NetManager;
	netManager.GetResponse();
}


function CheckTimer()
{
	if (Time.realtimeSinceStartup - lastCheck > 1)
	{
		lastCheck = Time.realtimeSinceStartup;
	}
}

function OnMsg(abyBuffer)
{
	
	//Debug.Log(buffer);
	var cmd = System.BitConverter.ToInt32(abyBuffer,4);
	//Debug.Log('OnMsg:' + cmd);
	//Debug.Log(System.BitConverter.ToString(abyBuffer));
	switch(cmd) 
	{
		case 101:
			OnLoginResponse(abyBuffer);
			break;
		case 102:
			OnBroadCastStatus(abyBuffer);
			break;
		case 103:
			OnBroadCastFire(abyBuffer);
			break;
		default:
			break;
	}
	
}

function OnLoginResponse(abyBuffer)
{
	var myTankID = System.BitConverter.ToInt32(abyBuffer,8);
	Debug.Log('OnLoginResponse, my tank id : ' + myTankID);
	m_id = myTankID;
	
	var tankCount = System.BitConverter.ToInt32(abyBuffer,12);
	Debug.Log('OnLoginResponse, get tank count :' + tankCount);
	
	var index = 16;
	for (var i = 0; i< tankCount; ++i)
	{
		
		var t:TankModel = new TankModel();
		index += t.Decode(abyBuffer,index);
		CreateTank(t,myTankID);
	} 
}

function OnBroadCastStatus(abyBuffer)
{
		
	var tankCount = System.BitConverter.ToInt32(abyBuffer,8);
	//Debug.Log('OnBroadCastStatus, get tank count :' + tankCount);
	
	var index = 12;
	var tank_list = new int [tankCount];
	for (var i = 0; i< tankCount; ++i)
	{
		var t:TankModel = new TankModel();
		index += t.Decode(abyBuffer,index);
		if(t.m_id != m_id)
		{
			UpdateTank(t);
		}
		tank_list[i] = t.m_id;
	}

	var list = GameObject.FindGameObjectsWithTag("Enemy");
	if (list != null)
	{
		for (var l in list)
		{
			var enemyTank:EnemyTank = l.GetComponent('EnemyTank') as EnemyTank;
			for(var k = 0 ; k < tank_list.length; ++k)
			{
				if(tank_list[k] == enemyTank.m_id)
				{
					break;
				}
			}
			
			if(k == tank_list.Length)
			{//in clint but not on server
				Debug.Log('destroy tank' + enemyTank.m_id);
				DestroyObject(l);
				
			}
			
		}
	}	
}

function OnBroadCastFire(abyBuffer)
{
	var tankID = System.BitConverter.ToInt32(abyBuffer,8);
	//Debug.Log('OnFire, shoot by :' + tankID);
	
	var pos:Vector3;
	var rotation:Quaternion;
	var speed:Vector3;
	
	var index = 12;
	pos.x = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	pos.y = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	pos.z = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	
	rotation.x = System.BitConverter.ToSingle(abyBuffer,index);
	index+=4;
	rotation.y = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	rotation.z = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	rotation.w = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	
	speed.x = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	speed.y = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	speed.z = System.BitConverter.ToSingle(abyBuffer,index);
	index += 4;
	
	var newBullet:Rigidbody;
	newBullet = Instantiate(bullet,pos,rotation);
	newBullet.rigidbody.velocity = speed;
	
	
}
function CreateTank(tankmodel:TankModel,mytankid)
{
	var pos:Vector3;
	var rot:Quaternion;
	pos = tankmodel.m_pos; 
	
	if(mytankid != tankmodel.m_id){
		var newTankE = Instantiate(enemyTank,pos,rot);
		newTankE.transform.eulerAngles = tankmodel.m_eulerAngle;
		newTankE.transform.rigidbody.velocity = tankmodel.m_velocity;
		newTankE.m_id = tankmodel.m_id;
	}else{
		var newTankM = Instantiate(myTank,pos,rot);
		newTankM.transform.eulerAngles = tankmodel.m_eulerAngle;
		newTankM.transform.rigidbody.velocity = tankmodel.m_velocity;
		newTankM.m_id = tankmodel.m_id;
		m_id = tankmodel.m_id;
	}
}

function UpdateTank(tankmodel:TankModel)
{
	var result = false;
	var list = GameObject.FindGameObjectsWithTag("Enemy");
	if (list != null)
	{
		for (var l in list)
		{
			var enemyTank:EnemyTank = l.GetComponent('EnemyTank') as EnemyTank;
			if(enemyTank.m_id == tankmodel.m_id)
			{
				//Debug.Log('update '+tankmodel.m_id);
				l.transform.position = tankmodel.m_pos;
				l.transform.eulerAngles = tankmodel.m_eulerAngle;
				l.rigidbody.velocity = tankmodel.m_velocity;
				result = true;//found
			}
		}
	}
	
	//in server but not in client
	if(result == false)
	{
		if(tankmodel != myTank.m_id)
		{
			CreateTank(tankmodel,myTank.m_id);
		}
	}
	
	
}

