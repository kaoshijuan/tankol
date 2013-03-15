#pragma strict

function Start () {

}

function Update () {

}

function OnGUI(){
	//DisplayUserList();
}

function DisplayUserList()
{
	
	var stringList = '';
	var player = GameObject.FindGameObjectWithTag("Player");
	if(player)
	{
		var playerTank:PlayerTank = player.GetComponent("PlayerTank") as PlayerTank;
		if(playerTank)
		{
			var height = 40;
			stringList += (playerTank.m_iShootCount.ToString()+ '\t' + playerTank.m_sName + "\n" );
			var list = GameObject.FindGameObjectsWithTag("Enemy");
			for (var l in list)
			{
				var enemyTank = l.GetComponent("EnemyTank") as EnemyTank;
				stringList += (enemyTank.m_iShootCount.ToString() +'\t' + enemyTank.m_sName + "\n");
				height+= 40;
			}
			
			GUI.Box(Rect(10,10,80,height),stringList);				
		}
	}
			
}