using UnityEngine;
using System.Collections;
using System;


public class NetManager:MonoBehaviour{
	private CTCPConn m_stTCPConn;
	// Use this for initialization
	void Start () {

	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	public int Init()
	{
		m_stTCPConn = new CTCPConn();
		int iResult = m_stTCPConn.ConnectTo("172.25.42.46",80);
		//int iResult = m_stTCPConn.ConnectTo("42.96.139.24",80);
		return iResult;	
	}
	

	public void Login(string m_uid,string m_name)
	{
		int index = 0;
		
		byte []abyBuffer = new byte[1024];
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);
		
		System.Text.UTF8Encoding enc = new System.Text.UTF8Encoding(true, true);
		byte [] uidbuffer = enc.GetBytes(m_uid);
		
		Array.Copy(System.BitConverter.GetBytes(uidbuffer.GetLength(0)),0,abyBuffer,index,sizeof(int)); //uidlen
		index += sizeof(int);
		
		Array.Copy(uidbuffer,0,abyBuffer,index,uidbuffer.GetLength(0));
		index += uidbuffer.GetLength(0);
		
		Array.Copy(System.BitConverter.GetBytes((int)1),0,abyBuffer,index ,sizeof(int));//CmdID
		index += sizeof(int);
		
		System.Text.UTF8Encoding enc_name = new System.Text.UTF8Encoding(true, true);
		byte [] namebuffer = enc_name.GetBytes(m_name);

		Array.Copy(System.BitConverter.GetBytes(namebuffer.GetLength(0)),0,abyBuffer,index,sizeof(int)); //namelen
		index += sizeof(int);
		
		Array.Copy(namebuffer,0,abyBuffer,index,namebuffer.GetLength(0));
		index += namebuffer.GetLength(0);		

		Array.Copy(System.BitConverter.GetBytes(index),0,abyBuffer,0,sizeof(int));//Len rewrite back
		
		m_stTCPConn.SendOneCode(abyBuffer,(uint)index);
	}
	
	public void UpdatePosVelocity(string m_uid,Vector3 pos,Vector3 eulerAngle, Vector3 velocity)
	{
		byte []abyBuffer = new byte[1024];
		
		int index = 0;
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);
		
		System.Text.UTF8Encoding enc = new System.Text.UTF8Encoding(true, true);
		byte [] uidbuffer = enc.GetBytes(m_uid);
		
		Array.Copy(System.BitConverter.GetBytes(uidbuffer.GetLength(0)),0,abyBuffer,index,sizeof(int)); //uidlen
		index += sizeof(int);
		
		Array.Copy(uidbuffer,0,abyBuffer,index,uidbuffer.GetLength(0));
		index += uidbuffer.GetLength(0);
		
		
		Array.Copy(System.BitConverter.GetBytes((int)2),0,abyBuffer,index,sizeof(int));//CmdID
		index += sizeof(int);

		Array.Copy(System.BitConverter.GetBytes(pos.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(pos.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(pos.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		Array.Copy(System.BitConverter.GetBytes(velocity.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(velocity.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(velocity.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		Array.Copy(System.BitConverter.GetBytes(eulerAngle.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(eulerAngle.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(eulerAngle.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		
		Array.Copy(System.BitConverter.GetBytes(index),0,abyBuffer,0,sizeof(int));//Len
		
		m_stTCPConn.SendOneCode(abyBuffer,(uint)index);
	}
	
	public void Fire(string m_uid,Vector3 pos, Quaternion rotation, Vector3 speed)
	{
		byte []abyBuffer = new byte[1024];
		
		int index = 0;
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);

		System.Text.UTF8Encoding enc = new System.Text.UTF8Encoding(true, true);
		byte [] uidbuffer = enc.GetBytes(m_uid);
		
		Array.Copy(System.BitConverter.GetBytes(uidbuffer.GetLength(0)),0,abyBuffer,index,sizeof(int)); //uidlen
		index += sizeof(int);
		
		Array.Copy(uidbuffer,0,abyBuffer,index,uidbuffer.GetLength(0));
		index += uidbuffer.GetLength(0);		
		
		Array.Copy(System.BitConverter.GetBytes((int)3),0,abyBuffer,index,sizeof(int));//CmdID
		index += sizeof(int);

		
		Array.Copy(System.BitConverter.GetBytes(pos.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(pos.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(pos.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		Array.Copy(System.BitConverter.GetBytes(rotation.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(rotation.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(rotation.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(rotation.w),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		Array.Copy(System.BitConverter.GetBytes(speed.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(speed.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(speed.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		
		
		Array.Copy(System.BitConverter.GetBytes(index),0,abyBuffer,0,sizeof(int));//Len
		
		m_stTCPConn.SendOneCode(abyBuffer,(uint)index);		
	}
	
	public void HitTarget(int id)
	{
		
	}
	
	public void Exit(string m_uid)
	{
		int index = 0;
		
		byte []abyBuffer = new byte[1024];
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);
		
		System.Text.UTF8Encoding enc = new System.Text.UTF8Encoding(true, true);
		byte [] uidbuffer = enc.GetBytes(m_uid);
		
		Array.Copy(System.BitConverter.GetBytes(uidbuffer.GetLength(0)),0,abyBuffer,index,sizeof(int)); //uidlen
		index += sizeof(int);
		
		Array.Copy(uidbuffer,0,abyBuffer,index,uidbuffer.GetLength(0));
		index += uidbuffer.GetLength(0);
		
		Array.Copy(System.BitConverter.GetBytes((int)5),0,abyBuffer,index ,sizeof(int));//CmdID
		index += sizeof(int);
		
		Array.Copy(System.BitConverter.GetBytes(index),0,abyBuffer,0,sizeof(int));//Len rewrite back
		
		m_stTCPConn.SendOneCode(abyBuffer,(uint)index);		
	}
	
	public void GetResponse()
	{
		if(m_stTCPConn.CheckConn() == false)
		{
			SendMessage("OnClose");
			return;
		}
		
		byte [] abyBuffer = null;
		uint uiLen = 0;
		uint uiRet = 0;
		uiRet = m_stTCPConn.GetOneCode(ref abyBuffer,ref uiLen);
		if(uiRet > 0)
		{
			byte [] temp = new byte [uiLen - 4];
			Array.Copy(abyBuffer,4,temp,0,uiLen-4);
			ProcessMsg(temp,uiLen);
		}
		return;
	}
	
	void ProcessMsg(byte [] abyBuffer, uint uiLen)
	{
		SendMessage("OnMsg",abyBuffer);
	}

}
