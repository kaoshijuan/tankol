using UnityEngine;
using System.Collections;
using System;

public class GameGUI : MonoBehaviour {
	
	private CTCPConn tcpconn;
	// Use this for initialization
	void Start () {
		tcpconn = new CTCPConn();
		tcpconn.ConnectTo("172.25.42.46",80);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI(){
		if(GUI.Button(new Rect(10,70,50,30), "click"))
		{
			Debug.Log ("clicked");
			uint iLen = 10240;
			byte []code = new byte[iLen];
			byte []temp = System.BitConverter.GetBytes(iLen);
			Array.Copy(temp,code,temp.GetLength(0));
			code[4] = (byte)'h';
			code[5] = (byte)'e';
			tcpconn.SendOneCode(code,iLen);
		}
		

		byte [] buffer = null;
		uint iRecvLen = 102400;
		
		uint iRet = tcpconn.GetOneCode(ref buffer,ref iRecvLen);
		if(iRet>0)
		{
			Debug.Log ("received response");
		}		
		
	}
}
