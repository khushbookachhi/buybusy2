
import style from './products.module.css';

import Card from '../../components/card/Card.jsx';

import { useEffect, useState } from 'react';
import Loader from '../../components/loader/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducers.js';
import { productActions, productSelector } from '../../redux/reducers/productsReducers.js';
import { toast } from 'react-toastify';



function Products(){
  const [loading,setLoading]=useState(true); // State variable to track loading state
  const dispatch=useDispatch(); // useDispatch hook to dispatch actions
  const [filterState,setFilterState]=useState(0); // State variable for filter value
  const [checkedState, setCheckedState] = useState({ // State variable for category checkboxes
    "Men's Clothing": false,
    "Women's Clothing": false,
    "Jewelery": false,
    "Electronics": false,
  });
  
  const {userID}=useSelector(userSelector); // Selector to get user ID from Redux store
  const {products,successMsg,errorMsg}=useSelector(productSelector); // Selector to get products, successMsg, and errorMsg from Redux store

   // Effect to handle loading state
  useEffect(()=>{
    if(loading){
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
   },[setLoading,loading])
     // Effect to handle success and error messages
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
  },[dispatch,successMsg,errorMsg])
// Function to handle filter value change
function changeValue(newVal){
setFilterState(newVal);
}
// Function to handle category checkbox change
const handleChange = (event) => {
  const { name, checked } = event.target;
  setCheckedState(prevState => ({
    ...prevState,
    [name]: checked
  }));
};
// Effect to dispatch filterProducts action when filterState or checkedState changes
useEffect(() => {
   dispatch(productActions.filterProducts({filterState,checkedState}))
// eslint-disable-next-line
}, [filterState,checkedState]);
    return(
        <>
        <div className="container-fluid d-flex justify-content-center bg-white">
        {loading?<Loader/>:
       <div className="container-fluid d-flex flex-column align-items-center bg-white">
        {/* input to search product by name */}
       <div className={`${style.input} input-group mb-3 my-3`}>
       <input className="form-control form-control-lg text-primary bg-light border border-primary"
        type="search" placeholder="Search By Name"  
        onChange={(e)=>{dispatch(productActions.handleSearch(e.target.value))}}
        />
</div>
{/* showing product after mapping products  */}
        <div className={`${style.product_container} d-flex py-5 my-2 bg-white`}>
          { products.length>0 && products.map((product,index)=>{
               return (
                <Card
                key={product.id}
               product={product}
                userID={userID}
                index={index}
                />                    
               ) 
          })}
 
        </div>
        {/* filter products based on price and categories  */}
       <div className={style.filterBox}>
        <div className={style.filter}>
          <h5 className='fw-bold text-center'>Filter</h5>
          <label className='fw-bold text-center '>Price:- {filterState}</label>
          <input type="range" min="1" max="100000" step={100} 
          onInput={(e)=>changeValue(e.target.value)}
          />
        </div>
        <div className={style.category}>
        <h5 className='fw-bold text-center'>Category</h5>
      <div className='text-left px-2'>
      {Object.keys(checkedState).map((optionKey,index) => (
       <div key={index}>
        <label>
          <input
            type="checkbox"
            name={optionKey}
            checked={checkedState[optionKey]}
            onChange={handleChange}
          /> {optionKey}
        </label> <br/>
       </div>
      ))}
     
      </div>
      
        </div>
       </div>
       </div>
       }
        </div>
     
        </>

    )
}
export default Products;