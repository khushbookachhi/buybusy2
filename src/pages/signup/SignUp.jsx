import {useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import style from './SignUp.module.css'; 
import { signUpAsync, userSelector } from '../../redux/reducers/userReducers';
import { toast } from 'react-toastify';

function SignUp(){
   const navigate = useNavigate(); // Initializing useNavigate hook for navigation
   const [name,setName]=useState(""); // State variable for storing name input value
   const [email,setEmail]=useState(""); // State variable for storing email input value
   const [password,setPassword]=useState(""); // State variable for storing password input value
   const dispatch=useDispatch(); // Initializing useDispatch hook to dispatch actions
   const {errorMsg,successMsg}=useSelector(userSelector); // Selecting errorMsg and successMsg from Redux store using userSelector
  
  // Effect to handle success and error messages
   useEffect(()=>{
      if(successMsg){
       toast.success(successMsg);
       setTimeout(() => {
         navigate('/signin');
       },3000);
      }
      if(errorMsg){
       toast.error(errorMsg);
      }
      // eslint-disable-next-line
      },[successMsg,errorMsg])
        // Function to validate input fields
   function isValidInput(name,email,password){
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      const passwordFormat=!(/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password));
      
      if(name.length>0 && emailRegex.test(email) &&( password.length>=8 && !passwordFormat)){
         return true
      }else{
         return false;
      }
     } 
     // Function to handle sign-up form submission
   function signUpOnSubmit(){
    
    const isValid=isValidInput(name,email,password);
    if(isValid){
    dispatch(signUpAsync({name,email,password}));
   }

}
return(
   <>

   <div className={`${style.signin} container my-5`}>
   <h1 className='fw-bold my-5'>Sign Up</h1>
   {/* form to submit user data */}
   <form className='container' 
   onSubmit={(e)=>{e.preventDefault(); signUpOnSubmit()}}
   >
   <div className="mb-3">
      {/* input for name  */}
   <input type="text" className="form-control border-primary border-1" placeholder='Enter Name' required
   onChange={(e)=>{setName(e.target.value);}}
   />
 </div>
 <div className="mb-3">
    {/* input for email  */}
   <input type="email" className="form-control border-primary border-1" placeholder='Enter Email' required
    onChange={(e)=>{setEmail(e.target.value);}}
    />
 </div>
 <div className="mb-3">
    {/* input for password  */}
   <input type="password" className="form-control border-primary border-1" placeholder='Enter Password' required
    onChange={(e)=>{setPassword(e.target.value);}}
    />
 </div>
 {/* submit button  */}
 <button type="submit" className={` ${style.button} btn btn-primary`}>Sign Up</button>
</form>

   </div>
   </>
)
}
export default SignUp;