using UnityEngine;
using System;
using System.Collections;

public class TankModel {
	
	public string m_uid;
	public int m_iLevel;
	public int m_iReserve1;
	public int m_iReserve2;
	public int m_iReserve3;
	public int m_iReserve4;
	public Vector3 m_pos;
	public Vector3 m_velocity;
	public Vector3 m_eulerAngle;
	public string m_name;
	
	public int Encode(ref byte [] abyBuffer, int index)
	{/*
		int temp = index;
		Array.Copy(System.BitConverter.GetBytes(m_id),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		
		Array.Copy(System.BitConverter.GetBytes(m_pos.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_pos.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_pos.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);		
		
		Array.Copy(System.BitConverter.GetBytes(m_velocity.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_velocity.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_velocity.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);	

		Array.Copy(System.BitConverter.GetBytes(m_eulerAngle.x),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_eulerAngle.y),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);
		Array.Copy(System.BitConverter.GetBytes(m_eulerAngle.z),0,abyBuffer,index,sizeof(float));
		index += sizeof(float);			
		
		Array.Copy(System.BitConverter.GetBytes(m_iLevel),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		
		Array.Copy(System.BitConverter.GetBytes(m_iReserve1),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes(m_iReserve2),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes(m_iReserve3),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		Array.Copy(System.BitConverter.GetBytes(m_iReserve4),0,abyBuffer,index,sizeof(int));
		index += sizeof(int);
		
		return index - temp;*/
		return 0;
	}
	
	public int Decode(byte[] abyBuffer,int index)
	{
		
		int temp = index;
		
		int uidLen = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		
		m_uid = System.Text.Encoding.UTF8.GetString(abyBuffer,index,uidLen);	
		index += uidLen;
		
		m_pos.x = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_pos.y = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_pos.z = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);

		m_velocity.x = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_velocity.y = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_velocity.z = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);		

		m_eulerAngle.x = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_eulerAngle.y = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		m_eulerAngle.z = System.BitConverter.ToSingle(abyBuffer,index);
		index += sizeof(float);
		
		m_iLevel = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		
		m_iReserve1 = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		m_iReserve2 = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		m_iReserve3 = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		m_iReserve4 = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		
		
		int nameLen = System.BitConverter.ToInt32(abyBuffer,index);
		index += sizeof(int);
		
		m_name = System.Text.Encoding.UTF8.GetString(abyBuffer,index,nameLen);
		index +=nameLen;
		
		return index - temp;
		
	}
	
}
