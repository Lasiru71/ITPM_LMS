import Navbar from "../../components/Navbar";
import axios from "../../api/axios";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GenerateQR(){

 const [token,setToken] = useState("");

 const generate = async () => {

  const res = await axios.post("/attendance/create-session",{
   courseId:"course1",
   lecturerId:"lect1"
  });

  setToken(res.data.token);
 };

 return(
  <div>

   <Navbar/>

   <button onClick={generate}>Generate QR</button>

  {token && (
  <QRCodeCanvas value={`http://localhost:5173/scan?token=${token}`} size={220} />
)}

  </div>
 );
}