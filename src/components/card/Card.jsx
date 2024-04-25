import plus from '../../icons/plus.png';
import minus from '../../icons/minus.png';
import style from './card.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseQuantity, increaseQuantity, productSelector, removeFromCart } from '../../redux/reducers/productsReducers';


function Card({product,userID,path,index}){
    const dispatch=useDispatch(); // Initializing useDispatch hook to dispatch actions
    const {processing}=useSelector(productSelector); // Selecting processing state from Redux store using productSelector
return(
    <>
    <div className="card position-relative border border-0 shadow  rounded" key={product.id} style={{"width": "18rem","height":"35rem"}}>
                 <img src={product.image} className={`${style.card_img} my-3 mb-0 card-img-top`} alt="..."/>
                 <div className={`${style.CardBody} card-body`}>
                     <h6 className="card-title fw-semibold fs-5">{product.title.split(/\s+/).slice(0, 6).join(' ')}...</h6>
                     <h5 className={`${style.price}  my-5`}>&#8377; {product.price}</h5>
                     {/* // Rendering quantity control if path is provided */}
                     {path?<div className={`${style.quantity}`}> 

                        <img src={minus} alt='minus'  
                        onClick={()=>{dispatch(decreaseQuantity({product,userID}))}}
                        /> 
                        <span>&nbsp;{product.quantity}&nbsp;</span>  {/* Product quantity */}
                        <img src={plus} alt='plus' 
                        onClick={()=>{dispatch(increaseQuantity({product,userID}))}}
                        /></div>:null}
                          {/* Conditional rendering of button based on path (Add to Cart or Remove from Cart) */}
                   {<button className={`btn ${style.btn2} ${path?"btn-danger":"btn-primary px-5"} btn-lg`}
                      onClick={()=>{!path?dispatch(addToCart({product,userID,index})):dispatch(removeFromCart({product,userID,index}))}}
                      >
                        {path?processing[index]?"Removing":"Remove From Cart":processing[index]?"Adding":"Add To Cart"}
                        </button>}
                 </div>
               </div>
    </>
)
}
export default Card;