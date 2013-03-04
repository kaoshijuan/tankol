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
		return iResult;	
	}
	public void Login()
	{
		byte []abyBuffer = new byte[8];
		Array.Copy(System.BitConverter.GetBytes((int)8),0,abyBuffer,0,4);//Len
		Array.Copy(System.BitConverter.GetBytes((int)1),0,abyBuffer,4,4);//CmdID
		m_stTCPConn.SendOneCode(abyBuffer,8);
	}
	
	public void UpdatePosVelocity(int m_id,Vector3 pos,Vector3 eulerAngle, Vector3 velocity)
	{
		byte []abyBuffer = new byte[1024];
		
		int index = 0;
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes((int)2),0,abyBuffer,index,sizeof(int));//CmdID
		index += sizeof(int);
		
		Array.Copy(System.BitConverter.GetBytes(m_id),0,abyBuffer,index,sizeof(int));//CmdID
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
	
	public void Fire(int m_id,Vector3 pos, Quaternion rotation, Vector3 speed)
	{
		byte []abyBuffer = new byte[1024];
		
		int index = 0;
		Array.Copy(System.BitConverter.GetBytes((int)0),0,abyBuffer,index,sizeof(int));//Len
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes((int)3),0,abyBuffer,index,sizeof(int));//CmdID
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes(m_id),0,abyBuffer,index,sizeof(int));//id
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
	
	public void Exit()
	{
		
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
			//
			ProcessMsg(abyBuffer,uiLen);
		}
		return;
	}
	
	void ProcessMsg(byte [] abyBuffer, uint uiLen)
	{
		SendMessage("OnMsg",abyBuffer);
	}

}
