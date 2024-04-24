import { createContext,useContext, useEffect, useState } from "react";
import {toast } from 'react-toastify';
import data from '../data/products.json';
import { arrayRemove, arrayUnion, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireBaseInit";
import { useValue as userValue } from "./userAuthentication";
const productsContext=createContext();
// custom hook 
function useValue(){
    const value=useContext(productsContext);
    return value;
}
//Component
function CustomProductContext({children}){
    const [products,setProducts]=useState(data);
    const [cartItems,setCartItems]=useState([]);
    const [myOrders,setMyOrders]=useState([]);
    const {user,setUser}=userValue();
    const [totalPrice,setTotalPrice]=useState(0);
    const [path,setPath]=useState("");
    const [loading, setLoading] = useState(true);
    const [processing,setProcessing]=useState(new Array(products.length).fill(false));
    const [purchase,setPurchase]=useState(false);
    useEffect(()=>{
        if(path){
          console.log(path);
          setLoading(true);
        }
        // eslint-disable-next-line
        },[path])
    useEffect(()=>{
        const storedUser=localStorage.getItem('user');
        if(storedUser){
            setUser(storedUser);
        }
    },[setUser])
   
    useEffect(() => {
            const timeout = setTimeout(() => {
          setLoading(false); 
        }, 1200);
        return () => clearTimeout(timeout); 
      }, [loading]);

    
      const handleProcessTrue=(index)=>{
        console.log("handleProcessTrue called");
      setProcessing(prevState=>{
        const newState=[...prevState];
        if (index >= 0 && index < newState.length) { // Check index bounds
            newState[index] = true;
          } else {
            console.error("Invalid index:", index);
          }
        return newState;
      })}
      const handleProcessFalse=(index)=>{
        console.log("handleProcessFalse called");

            setProcessing(prevState=>{
                const newState=[...prevState];
                if (index >= 0 && index < newState.length) { // Check index bounds
                    newState[index] = false;
                  } else {
                    console.error("Invalid index:", index);
                  }
                return newState;
              })
         
      }
    

    const fetchCartItemsData = async () => {
      if (user) {
        const docRef = doc(db, "cartItems", user);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const products = docSnap.data().products;
            setCartItems(prevItems=>{
                return products;
            });
            console.log("fetchCartItemsData data:", cartItems);
           
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    const fetchMyOrdersData = async () => {
      if (user) {
        const docRef = doc(db, "myOrders", user);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const products = docSnap.data().products;
            setMyOrders(prevItems=>{
                return products;
            });
            console.log("fetchMyOrdersData data:", cartItems);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    
    useEffect(() => {
       
        fetchCartItemsData();
        fetchMyOrdersData();
      }, [user]);
    function handleSearch(targetValue){
if(data.length && targetValue){
  const filteredProducts = data.filter((product) =>
  product.title.toLowerCase().includes(targetValue.toLowerCase())
);
setProducts(filteredProducts);
  
}else{
  setProducts(data);
}
    }
    function handleFilter(filterState,checkedState){
      let filteredData = [...data];
      if(filterState>0){
       filteredData=filteredData.filter((product)=>
      product.price<=filterState
    );
      }
      
     const selectedCategories=Object.entries(checkedState)
     .filter(([key,value])=>value)
     .map(([key])=>key.toLowerCase());
      if(selectedCategories.length>0){
        filteredData=filteredData.filter(product=>
          selectedCategories.includes(product.category.toLowerCase()));
      }
     
      setProducts(filteredData);
    } 
   async function addToCart(product,userId,index){
    if(userId){
      try {
        
        await fetchCartItemsData();
        let productIndex=-1;
        if(cartItems){
         productIndex=cartItems.findIndex(elem=>elem.id===product.id);
        }
       
        console.log("productIndex",productIndex);
        handleProcessTrue(index);
        if(productIndex!==-1){
            cartItems[productIndex].quantity++;
            console.log("product existed!",cartItems);
            await updateDoc(doc(db,"cartItems",userId),
             {products:cartItems});
             toast.success("Increased Product Quantity!");
        }else{
            const productWithQuantity={...product,quantity:1};
            if(cartItems && cartItems.length){
                await updateDoc(doc(db,"cartItems",userId),
                {products:arrayUnion(productWithQuantity)});
            }else{
                await setDoc(doc(db,"cartItems",userId),
                {products:arrayUnion(productWithQuantity)});
            }
            toast.success("Product Added Successfully!");
            console.log("check Firestore");

            await fetchCartItemsData();
           
        }
        setTimeout(()=>{
         handleProcessFalse(index);
         },500) 

      } catch (error) {
        toast.error(error.message);
      }
    }
    
    }
    async function removeFromCart(product,userId,index){
   
     if(userId){
        const docRef = doc(db, 'cartItems', userId);
        try {
            const currentIndex = index;
            handleProcessTrue(currentIndex);
            setTimeout(async () => {
                await updateDoc(docRef, {
                  products: arrayRemove(product)
                });
                
                // After the delay, call handleProcessFalse
                handleProcessFalse(currentIndex);
        
                console.log("removing product");
                await fetchCartItemsData();
              },700);
              toast.success("Product Removed Successfully!")
          } catch (error) {
            console.error('Error removing element from array:', error);
            toast.error(error.message);
          }
     }
    }
    async function increaseQuantity(product,userId){
        if(userId){
            let productIndex=-1;
        if(cartItems){
         productIndex=cartItems.findIndex(elem=>elem.id===product.id);
        }
        if(productIndex!==-1){
            cartItems[productIndex].quantity++;
            console.log("product quantity Increased!");
            await updateDoc(doc(db,"cartItems",userId),
             {products:cartItems});
             await fetchCartItemsData();
        }
        }
    }
    async function decreaseQuantity(product,userId){
        if(userId){
            let productIndex=-1;
        if(cartItems){
         productIndex=cartItems.findIndex(elem=>elem.id===product.id);
        }
        if(productIndex!==-1 && cartItems[productIndex].quantity>1 ){
            cartItems[productIndex].quantity--;
            console.log("product quantity decreased!");
            await updateDoc(doc(db,"cartItems",userId),
             {products:cartItems});
            await fetchCartItemsData();
        }else if(cartItems[productIndex].quantity===1){
           await removeFromCart(product,userId);
        }
        }
    }
    function addTotalPrice(cartItems){
        setTotalPrice(0);
        if(cartItems){
            cartItems.map((item,index)=>{
                setTotalPrice((prevItems)=>{
                    return prevItems+(item.quantity*item.price);
                })
               })
        }
      
    }
    function getOrderDate(){
        const d=new Date();
        let month=d.getMonth()+1;
        let date=d.getDate();
        return d.getFullYear().toString()+"-"+(month<10?"0"+month.toString():month.toString())+"-"
        +(date<10?"0"+date.toString():date.toString());
    }
    async function removeAllCartItems(userId){
        const docRef = doc(db, 'cartItems', userId);

        // Remove the 'capital' field from the document
        await updateDoc(docRef, {
            products: deleteField()
        });
        
    }
   async function purchaseProduct(cartItems,userId,navigate){
    
    if(userId){
        const orderDate=getOrderDate();
        const createdOn=Date.now();
        const docRef = doc(db, "myOrders",userId);
        const docSnapshot = await getDoc(docRef);
        setTimeout(async()=>{
            if(docSnapshot.exists()){
                await updateDoc(doc(db,"myOrders",userId),
                {products:arrayUnion({orderDate,cartItems,totalPrice,createdOn})});
            }else{
                await setDoc(doc(db,"myOrders",userId),
                {products:arrayUnion({orderDate,cartItems,totalPrice,createdOn})});
            }
           
        },700);
       
        console.log("total purchase items added!");
        await fetchMyOrdersData();
        setTimeout(async() => {
            await removeAllCartItems(userId);
            setTotalPrice(0);
            setCartItems([]);
            setPurchase(prevState=>!prevState);
            navigate('/myOrders');
        },500);
       
    }
    }
return(
    <productsContext.Provider value={{products,handleSearch,handleFilter,addToCart,removeFromCart,
    increaseQuantity,decreaseQuantity,cartItems,myOrders,purchaseProduct
    ,addTotalPrice,totalPrice,path,setPath,loading,setLoading,processing,purchase,setPurchase}}>
        {children}
    </productsContext.Provider>
)
}
export {productsContext,useValue};
export default CustomProductContext;