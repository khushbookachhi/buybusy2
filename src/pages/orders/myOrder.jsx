import { useEffect, useState } from "react";

import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, productSelector } from "../../redux/reducers/productsReducers";
import { userSelector } from "../../redux/reducers/userReducers";

function MyOrder(){
 const dispatch=useDispatch();
 const [loading,setLoading]=useState(true);
 const {userID}=useSelector(userSelector)
 const {orders}=useSelector(productSelector);

   useEffect(()=>{
    dispatch(fetchMyOrders(userID));
    // eslint-disable-next-line
   },[])
   useEffect(()=>{
    if(loading){
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
   },[setLoading,loading])
    return(
        <>
      
       <div className="container-fluid d-flex flex-column align-items-center my-4">
        {!loading && <h2>Your Orders</h2>}
        {loading ?<Loader/>:
<div className="container">
       {orders? orders.map((product,index)=>{
   return (<div className="container d-flex flex-column align-items-center my-2" key={index}>
 <p className="text-center fs-4 fw-bold text-dark-emphasis">Ordered On:- {product.orderDate}</p>
 <table className="table table-bordered text-center p-0" style={{"width":"60vw"}}>
<thead className="border border-bottom-0">
<tr>
<th scope="col">Title</th>
<th scope="col">Price</th>
<th scope="col">Quantity</th>
<th scope="col">Total Price</th>
</tr>
</thead>

   { product.cartItems.map((cartItem,index)=>{
   return  <tbody key={index}>
    <tr>
    <td>{cartItem.title.split(/\s+/).slice(0, 6).join(' ')}...</td>
    <td>{cartItem.price}</td>
<td>{cartItem.quantity}</td>
<td>{cartItem.price*cartItem.quantity}</td>
</tr>
</tbody>
    })}
    <tbody>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>{product.totalPrice}</td>
</tr>
</tbody>
</table>
</div>)
       }):null}
       
        </div> }
        
       </div>
        </>

    )
}
export default MyOrder;