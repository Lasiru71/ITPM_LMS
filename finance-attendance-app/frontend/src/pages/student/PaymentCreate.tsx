import Navbar from "../../components/Navbar";
import PaymentForm from "../../components/PaymentForm";
import axios from "../../api/axios";

export default function PaymentCreate(){

 const pay=async()=>{
  await axios.post("/finance/pay",{
   studentId:"student1",
   courseId:"course1",
   method:"CARD"
  });
  alert("Payment created");
 };

 return(
  <div>
    <Navbar />
   <h2>Create Payment</h2>
   <button onClick={pay}>Pay</button>
    <PaymentForm />
  </div>
 );
}
