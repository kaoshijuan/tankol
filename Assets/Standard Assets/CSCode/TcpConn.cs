using UnityEngine;
using System;
using System.IO;
using System.Net.Sockets;
using System.Collections;

public class CTCPConn{
	
	const uint READ_BUFFER_SIZE = 102400;
	private TcpClient m_stClient;
	private byte[] m_abyReadBuffer = new byte[READ_BUFFER_SIZE];
	private uint m_iStartIndex = 0;
	private uint m_iEndIndex = 0;
	private string m_sIPAddr;
	private int m_iPort;
	public uint SendOneCode(byte [] code, uint iLen)
	{
		if(!m_stClient.Connected){
			Debug.LogError("Reconnect...");
			m_stClient = new TcpClient(m_sIPAddr,m_iPort);
		}
		byte [] tmpcode = new byte[iLen];
		Array.Copy(code,tmpcode,iLen);
		NetworkStream stream  = m_stClient.GetStream();
		stream.Write(tmpcode,0,(int)iLen);
		//stream.Flush();
		return iLen;
	}
	
		
	public uint GetOneCode(ref byte[] code, ref uint iCodeLen)
	{
		if(m_iStartIndex >= m_iEndIndex)
		{
			return 0;
		}
			
		uint iLen = System.BitConverter.ToUInt32(m_abyReadBuffer,(int)m_iStartIndex);
		if(iLen + m_iStartIndex > m_iEndIndex)
		{// code not complete ,still waiting for reading
			iCodeLen = 0;
			return 0;
		}
		
		code = new byte[iLen];
		Array.Copy(m_abyReadBuffer,m_iStartIndex,code,0,iLen);
		iCodeLen =  iLen;
		m_iStartIndex += iLen;
		return iLen;
	}
	
	public int ConnectTo(string sIPAddr, int iPort)
	{
		//m_stSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
		m_sIPAddr = sIPAddr;
		m_iPort = iPort;
		int iResult = 0;
		try {
			m_stClient = new TcpClient(sIPAddr,iPort);
			m_stClient.GetStream().BeginRead(m_abyReadBuffer,0,(int)READ_BUFFER_SIZE,new AsyncCallback(Recv),null);
		}catch{
			iResult = -1;
			Debug.Log("Create connection failed.");
		}
		
		return iResult;
	}
	
	public void Close()
	{
		m_stClient.Close();
	}
	
	public Boolean CheckConn()
	{
		return m_stClient.Connected;
	}
	
	private void Recv(IAsyncResult ar)
	{
		uint BytesRead;
		//int iResult = 0;
		try
		{
			// Finish asynchronous read into readBuffer and return number of bytes read.
			BytesRead = (uint)m_stClient.GetStream().EndRead(ar);
			if (BytesRead < 1) 
			{
				// if no bytes were read server has close.  
				//iResult = -1;
				Debug.Log ("Received failed");
				m_stClient.Close();
				return ;
			}
			m_iEndIndex += BytesRead;
			//Debug.Log ("Received msg, m_iStartIndex:"+m_iStartIndex.ToString()+",m_iEndIndex:"+m_iEndIndex.ToString());
			
			
			//check the buffer and rearrange
			if(m_iEndIndex == READ_BUFFER_SIZE)
			{
				if(m_iStartIndex > 0)
				{
					
					uint j = 0;					
					for(; j < m_iEndIndex - m_iStartIndex; ++j)
					{
						m_abyReadBuffer[j] = m_abyReadBuffer[m_iStartIndex+j];
					}
					m_iStartIndex = 0;
					m_iEndIndex = m_iStartIndex + j;
					//Debug.Log ("rearrange buffer,m_iStartIndex:"+m_iStartIndex.ToString()+",m_iEndIndex:"+m_iEndIndex.ToString());
				}
			}
			
			// Start a new asynchronous read into readBuffer.
			m_stClient.GetStream().BeginRead(m_abyReadBuffer, (int)m_iEndIndex, (int)(READ_BUFFER_SIZE - m_iEndIndex), new AsyncCallback(Recv), null);
			
		} 
		catch
		{
			//iResult = -2;
		}		
		//Debug.log(iResult);
		
		return ;
	}
}
