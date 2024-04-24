 import { Link,useNavigate } from 'react-router-dom';
 import style from './SignIn.module.css'; 
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, signInAsync, userSelector } from '../../redux/reducers/userReducers';


function SignIn(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {userID}=useSelector(userSelector);
  
useEffect(()=>{
if(userID){
  navigate('/');
}
// eslint-disable-next-line
},[userID])

function signInOnSubmit(){
    dispatch(signInAsync({email,password})) 
    navigate('/');
    setTimeout(() => {
     
      dispatch(actions.clearMsg());
    },3000);
  }
return(
    <>
   <div className={`${style.signin} container my-5`}>
    <h1 className='fw-bold my-5'>Sign In</h1>
    <form className='container'
     onSubmit={(e)=>{e.preventDefault(); signInOnSubmit()}}
     >
  <div className="mb-3">
    <input type="email" className="form-control border-primary border-1" placeholder='Enter Email' required
    onChange={(e)=>{setEmail(e.target.value);}}
    />
  </div>
  <div className="mb-3">
    <input type="password" className="form-control border-primary border-1" placeholder='Enter Password' required
     onChange={(e)=>{setPassword(e.target.value);}}
     />
  </div>
  
<button type="submit"  className={` ${style.button} btn btn-primary`}>
    Sign In</button>
</form>
<Link className='fw-bold my-3 fs-5' to="/signup">Or SignUp instead</Link>
    </div>
    </>
)
}
export default SignIn;