import axios from "../../api/axios";
import { useEffect, useState } from "react";

interface Payment {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  status: string;
}

export default function ApprovePayments(){

 const [payments,setPayments] = useState<Payment[]>([]);

 useEffect(()=>{

  axios.get("/finance/pending")
  .then(res => setPayments(res.data));

 },[]);

 const approve = async (id:string) => {

  await axios.patch(`/finance/approve/${id}`);

  alert("Approved");

 };

 return(

  <div>

   <h2>Pending Payments</h2>

   {payments.map(p => (

    <div key={p._id}>

      <p>Student: {p.studentId}</p>

      <button onClick={()=>approve(p._id)}>
        Approve
      </button>

    </div>

   ))}

  </div>

 );
}