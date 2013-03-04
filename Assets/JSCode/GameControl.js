#pragma strict



public var playerPre:PlayerTank;
public var enemyPre:EnemyTank;
public var bulletPre:Rigidbody;

private var lastCheck = 0;
private var m_id = 0;
private var connected_fail = false;
function Start () {

	var netManager = GetComponent("NetManager") as NetManager;
	if(netManager.Init()<0)
	{
		Debug.LogError('net mananger init failed');
		connected_fail = true;
	}else{
		netManager.Login();
	}
}

function OnClose()
{
	Debug.Log('connection reset, now restart');
	if(connected_fail == false)
	{
		Start();
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
	

	var cmd = System.BitConverter.ToInt32(abyBuffer,4);

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
	
	var index = 12;
	
	for (var i = 0; i< tankCount; ++i)
	{
		var tank:TankModel = new TankModel();
		index += tank.Decode(abyBuffer,index);
		if(tank.m_id != m_id)
		{
			UpdateTank(tank);
		}
	}
}

function OnBroadCastFire(abyBuffer)
{
	var tankID = System.BitConverter.ToInt32(abyBuffer,8);
	
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
	newBullet = Instantiate(bulletPre,pos,rotation);
	newBullet.rigidbody.velocity = speed;
	
	
}
function CreateTank(tankmodel:TankModel,mytankid)
{
	var pos:Vector3;
	var rot:Quaternion;
	pos = tankmodel.m_pos; 
	
	if(mytankid != tankmodel.m_id){
		var enemy = Instantiate(enemyPre,pos,rot);
		enemy.Init(tankmodel);
	}else{
		var player = Instantiate(playerPre,pos,rot);
		player.Init(tankmodel);
		m_id = tankmodel.m_id;
	}
}

function UpdateTank(tankmodel:TankModel)
{
	var founded = false;
	var list = GameObject.FindGameObjectsWithTag("Enemy");
	if (list != null)
	{
		for (var l in list)
		{
			var enemyTank:EnemyTank = l.GetComponent('EnemyTank') as EnemyTank;
			if(enemyTank.m_id == tankmodel.m_id)
			{
				enemyTank.UpdateStatus(tankmodel);
				founded = true;//found
			}
		}
	}
	
	//服务器下发的数据里有，但是本地没有找到相应的ID，那么创建出来。
	if(founded == false)
	{
		if(tankmodel != m_id)
		{
			CreateTank(tankmodel,m_id);
		}
	}
	
	//还有一种情况是在服务器上没有，但是本地服务器有相应的ID，在EnemyTank.js里面会自动destroy这些tank，这里不用处理
	
}

