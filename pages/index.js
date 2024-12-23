import axios from 'axios';
import React, { useEffect, useState } from 'react'


export default function Home() {
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    const URL = 'http://localhost:3000'
    const fetchQrCodeData = async () => {
      try {
        const response = await axios.get(URL + "/qr-code");
        const data = await response.data;
        setQrCodeData(data)
      } catch (error) {
        throw error;
      }
    };
    fetchQrCodeData()
  }, [])
  return (
    <div>
      <center>
        <h3>QR Code</h3>
        <img src={qrCodeData?.qrCodeImage} alt="QR Code" />
        <h3>Your Code is {qrCodeData?.code}</h3>
      </center>
    </div>
  )
}
