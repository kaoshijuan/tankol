using UnityEngine;
using System.Collections;
using System;

public class GameGUI : MonoBehaviour {
	
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
}


