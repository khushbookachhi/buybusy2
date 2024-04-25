import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import style from './cart.module.css'

import Card from "../../components/card/Card";
import TotalPrice from '../../components/totalPrice/TotalPrice';
import Loader from '../../components/loader/Loader';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducers';
import { fetchCartItems, productActions, productSelector } from '../../redux/reducers/productsReducers';


function Cart(){
  const location=useLocation(); // Using the useLocation hook to get the current location
  const [isCart,setIsCart]=useState(""); // State variable to track if the current page is the cart page
  const [loading,setLoading]=useState(true); // State variable to track the loading state
  const dispatch=useDispatch(); // useDispatch hook to dispatch actions
  const {userID}=useSelector(userSelector); // Selector to get user ID from Redux store
  const {cartItems,totalPrice,successMsg,errorMsg}=useSelector(productSelector); // Selectors to get cart items, total price, success and error messages from Redux store
    
   // Effect to fetch cart items when component mounts
    useEffect(()=>{
     dispatch(fetchCartItems(userID));
     // eslint-disable-next-line
     },[])

       // Effect to update isCart state and handle loading state
    useEffect(()=>{
      setIsCart(location.pathname);
      console.log(isCart);
      if(loading){
        setTimeout(() => {
          setLoading(false); 
         },1000);
      }
     // eslint-disable-next-line
     },[setIsCart,isCart,setLoading,loading])
      
     // Effect to calculate total price and display error message if cart is empty
      useEffect(()=>{
         dispatch(productActions.addTotalPrice(cartItems));
         if(isCart && ( !cartItems ||cartItems.length<1)){
          console.log("isCart ",isCart);
          toast.error("cart is empty!");
        }
        // eslint-disable-next-line 
    },[cartItems,isCart])
    // Effect to display success or error message on user actions
    useEffect(()=>{
      if(successMsg){
          console.log(successMsg);
       toast.success(successMsg);
       setTimeout(() => {
         dispatch(productActions.clearMsg());
       },3000);
      }
      if(errorMsg){
       toast.error(errorMsg);
      }
      // eslint-disable-next-line
    },[successMsg,errorMsg])

 
    return(
        <>
        <div className='container d-flex justify-content-center'>{loading && <Loader/>}</div>
      <div className="container-fluid d-flex justify-content-around bg-white">
     
        {(totalPrice && !loading) ? <TotalPrice cartItems={cartItems} userID={userID} totalPrice={totalPrice}/>:null}
        <div className={`${style.product_container} d-flex py-5 my-2 bg-white`}>
          {(!loading && cartItems) && cartItems.map((item,index)=>{
               return (
                <Card
                key={item.id}
               product={item}
                userID={userID}
                path={isCart}
                index={index}
                />
               )
          })}
 
        </div>
       
       </div>
        </>
     
    )
}
export default Cart;