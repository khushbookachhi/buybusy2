import { Link,useNavigate, Outlet } from 'react-router-dom';
import style from './Nav.module.css';
import house from '../../icons/house-color-icon.png';
import signin from '../../icons/signin.png';
import bag from '../../icons/bag.png';
import cart from '../../icons/cart.png';
import signout from '../../icons/exit.png';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, signOutAsync, userSelector } from '../../redux/reducers/userReducers';
import { toast } from 'react-toastify';
function Nav(){
  const [user,setUser]=useState(null); // State for user authentication status
   const navigate = useNavigate(); // Initializing useNavigate hook for navigation
   const dispatch=useDispatch(); // Initializing useDispatch hook to dispatch actions
   const {userID,errorMsg,successMsg}=useSelector(userSelector); // Selecting userID, errorMsg, and successMsg from Redux store using userSelector
    // useEffect to display success or error messages after authentication actions
  useEffect(()=>{
    if(successMsg){
        console.log("Success Msg Occuring!");
     toast.success(successMsg);
     setTimeout(() => {
       navigate('/');
       dispatch(actions.clearMsg());
     },3000);
    }
    if(errorMsg){
     toast.error(errorMsg);
    }
    // eslint-disable-next-line
    },[successMsg,errorMsg])
    // useEffect to update user state based on userID changes
   useEffect(()=>{
   if(userID){
    setUser(userID);
    console.log("useEffect running!!!");
   }else{
    setUser(null);
   }
   },[userID])

    return(
        <>
 <nav className="navbar py-3 px-5 shadow rounded">
  <div className="container-fluid">
    <Link className="navbar-brand text-primary fs-4" to="/">
     Busy Buy
    </Link>
    <div className={style.navLinks}>
        <Link className='mx-3' to="/" >
            <img className='mx-2' src={house} alt="house" style={{"width":"2rem"}}/>
             <h5>Home</h5>
        </Link>
        {user && <Link className='mx-3' to="/myOrders" >
            <img className='mx-1' src={bag} alt="bag" style={{"width":"2rem"}}/>
             <h5>My Orders</h5>
        </Link>}
        {user &&<Link className='mx-3' to="/cart" >
            <img className='mx-1' src={cart} alt="cart" style={{"width":"2rem"}}/>
             <h5>Cart</h5>
        </Link>}
       {!user ? <Link className='mx-3' to="/signin">
            <img className='mx-1' src={signin} alt="signin" style={{"width":"2rem"}}/>
            <h5>SignIn</h5>
        </Link>:<Link className='mx-3' 
        onClick={()=>{dispatch(signOutAsync());}}
        >
        <img className='mx-1' src={signout} alt="signout" style={{"width":"2rem"}}/>
        <h5>Logout</h5>
    </Link>
        }
        
    </div>
  </div>
</nav>
<Outlet/> {/* Outlet for rendering nested routes */}

        </>
    )
}
export default Nav;