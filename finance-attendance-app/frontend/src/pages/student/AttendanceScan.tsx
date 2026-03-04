
import axios from "../../api/axios";

export default function AttendanceScan(){

 const params=new URLSearchParams(window.location.search);
 const token=params.get("token");

 const mark=async()=>{
  await axios.post("/attendance/mark",{
   token,
   studentId:"student1"
  });

  alert("Attendance marked");
 };

 return(
  <div>
   <button onClick={mark}>Mark Attendance</button>
  </div>
 );
}
