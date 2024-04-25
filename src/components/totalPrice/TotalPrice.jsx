
import {useNavigate } from 'react-router-dom';
import style from './totalPrice.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { productActions, productSelector, purchaseProduct } from '../../redux/reducers/productsReducers';


function TotalPrice({cartItems,userID,totalPrice}){
  const dispatch=useDispatch(); // Initializing useDispatch hook to dispatch actions
  const navigate=useNavigate(); // Initializing useNavigate hook for navigation
  const {purchase}=useSelector(productSelector); // Selecting purchase state from Redux store using productSelector
    return(
        <>
        <div className={`${style.totalPrice} card text-center mx-2 mb-3` }style={{"width": "17rem","height":"5rem"}}>
  <div className="card-body bg-primary-subtle rounded-2">
    {/* total price display  */}
    <h5 className="card-title fs-5 fw-bold text-dark-emphasis">Total Price:- <span>&#8377;{totalPrice}/-</span></h5>
     {/* Button for purchasing, text depends on whether purchase is in progress */}
    <button className="btn btn-primary fs-4 my-3 px-2 py-0"
    onClick={(e)=>{e.preventDefault();
      dispatch(productActions.setPurchase());
      dispatch(purchaseProduct({cartItems,userID,totalPrice,navigate}))}}
    >{purchase?"Purchasing":"Purchase"}</button>
  </div>
</div>
        </>
    )
}
export default TotalPrice;