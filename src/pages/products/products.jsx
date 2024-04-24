
import style from './products.module.css';

import Card from '../../components/card/Card.jsx';

import { useEffect, useState } from 'react';
import Loader from '../../components/loader/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducers.js';
import { productActions, productSelector } from '../../redux/reducers/productsReducers.js';
import { toast } from 'react-toastify';



function Products(){
  const [loading,setLoading]=useState(true);
  const dispatch=useDispatch();
  const [filterState,setFilterState]=useState(0);
  const [checkedState, setCheckedState] = useState({
    "Men's Clothing": false,
    "Women's Clothing": false,
    "Jewelery": false,
    "Electronics": false,
  });
  
  const {userID}=useSelector(userSelector);
  const {products,successMsg,errorMsg}=useSelector(productSelector);

  useEffect(()=>{
    if(loading){
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }
   },[setLoading,loading])
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

function changeValue(newVal){
setFilterState(newVal);
}
const handleChange = (event) => {
  const { name, checked } = event.target;
  setCheckedState(prevState => ({
    ...prevState,
    [name]: checked
  }));
};
useEffect(() => {
   dispatch(productActions.filterProducts({filterState,checkedState}))
// eslint-disable-next-line
}, [filterState,checkedState]);
    return(
        <>
        <div className="container-fluid d-flex justify-content-center bg-white">
        {loading?<Loader/>:
       <div className="container-fluid d-flex flex-column align-items-center bg-white">
       <div className={`${style.input} input-group mb-3 my-3`}>
       <input className="form-control form-control-lg text-primary bg-light border border-primary"
        type="search" placeholder="Search By Name"  
        onChange={(e)=>{dispatch(productActions.handleSearch(e.target.value))}}
        />
</div>
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