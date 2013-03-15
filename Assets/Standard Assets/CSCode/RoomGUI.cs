using UnityEngine;
using System.Collections;
using System;

public class RoomGUI : MonoBehaviour {
	
	private CTCPConn tcpconn;
	public string m_userName = "RTX";
	private bool m_inGame = false;
	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI(){
		if(m_inGame)
		{
			InGameGUI();
		}else{
			m_userName = GUI.TextField(new Rect(10, 10, 200, 20),m_userName,25);
			if(GUI.Button(new Rect(10,70,50,30),"Login"))
			{
				if(m_userName != "RTX" && m_userName != "")
				{
					Debug.Log ("Login: " + m_userName);
					Application.LoadLevel("Battle");
					m_inGame = true;
				}

			}
		}
	}
	
	void Awake()
	{
		DontDestroyOnLoad(transform.gameObject);
	}
	
	void InGameGUI()
	{
		if(Input.GetKey(KeyCode.Tab))
		{
			DisplayUserList();
		}
	}
	
	void DisplayUserList()
	{
/*		GameObject []list = GameObject.FindGameObjectsWithTag("Enemy");
		string nameList = "";
		GameObject player = GameObject.FindGameObjectWithTag("Player");
		PlayerTank playerTank = player.GetComponent("PlayerTank") as PlayerTank;
		int height = 30;
		if(playerTank)
		{
			nameList += (playerTank.m_iShootCount.toString()+ '\t' + playerTank.m_name + "\n" );
			for(int i = 0; i < list.GetLength(0); ++i)
			{
				EnemyTank enemyTank = list[i].GetComponent("EnemyTank") as EnemyTank;
				nameList += (enemyTank.m_name + "\n");
				height+= 30;
			}
			
			GUI.Box(Rect(10,10,50,height),nameList);
		}*/
	}
}


