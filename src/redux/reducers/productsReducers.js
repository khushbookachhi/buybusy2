import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productsData from '../../data/products.json';
import { arrayRemove, arrayUnion, deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../fireBaseInit';
//initialize state for user slice
const initialState={
    products:productsData,
    cartItems:[],
    orders:[],
    successMsg:null,
    errorMsg:null,
    processing:new Array(productsData.length).fill(false),
    totalPrice:0,
    purchase:false,
    loading:true
}
// async function to fetch cartitems from firestore
export const fetchCartItems=createAsyncThunk("product/fetchCart",async(payload)=>{
    console.log("fetchCartItems is calling",payload);
    const docRef = doc(db, "cartItems", payload);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const products = await docSnap.data().products;
            console.log("fetchCartItemsData Async: ", products);
             return products;
          } else {
            console.log("No such document!");
            return ;
          }
    } catch (error) {
        console.log(error);
    }
  
});
// async function to fetch myOrders from firestore
export const fetchMyOrders=createAsyncThunk("product/fetchOrders",async(payload)=>{
    console.log("fetchMyOrders is calling",payload);
    const docRef = doc(db, "myOrders", payload);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const products = await docSnap.data().products;
            console.log("fetchMyOrdersData Async: ", products);
             return products;
          } else {
            console.log("No such document!");
            return ;
          }
    } catch (error) {
        console.log(error);
    }
})
//async function to add items in cart 
export const addToCart=createAsyncThunk("product/addCart",async(payload,{dispatch,rejectWithValue,getState})=>{
    const {product,userID,index}=payload;
    console.log("addToCart is calling ",userID);
    try {
        await dispatch(fetchCartItems(userID));
        let cartItems=getState().productsReducer.cartItems;
        console.log("cartItems is ",cartItems);
        let productIndex= -1; let message="";
        if(cartItems){
            productIndex=cartItems.findIndex(elem=>elem.id===product.id);
        }
        console.log("productIndex",productIndex);
        let isBoolean="true";
       dispatch(productActions.setProcess({index,isBoolean}));
        if(productIndex!==-1){
            let newCartItems=JSON.parse(JSON.stringify(cartItems))
            newCartItems[productIndex].quantity++;//={...newCartItems[productIndex],quantity:newCartItems[productIndex].quantity++};
           
            console.log("product existed!",newCartItems);
            await updateDoc(doc(db,"cartItems",userID),
             {products:newCartItems});
             message="Increased Product Quantity!";
        }else{
            const productWithQuantity={...product,quantity:1};
            if(cartItems && cartItems.length>0){
                await updateDoc(doc(db,"cartItems",userID),
                {products:arrayUnion(productWithQuantity)});
            }else{
                await setDoc(doc(db,"cartItems",userID),
                {products:arrayUnion(productWithQuantity)});
            }
           message= "Product Added Successfully!";
            
        }
        await dispatch(fetchCartItems(userID));
        setTimeout(()=>{
            isBoolean="false";
           dispatch(productActions.setProcess({index,isBoolean}));
            },500)
        return message;
    } catch (error) {
        return  rejectWithValue(error.message);
    }
});
//async function for removing product from cart
export const removeFromCart=createAsyncThunk("product/removeCart",async(payload,{dispatch,rejectWithValue})=>{
    const {product,userID,index}=payload;
    const docRef = doc(db, 'cartItems', userID);
    let isBoolean="";
    try{
        isBoolean="true";
        dispatch(productActions.setProcess({index,isBoolean}));
        setTimeout(async () => {
            await updateDoc(docRef, {
              products: arrayRemove(product)
            });
             // After the delay, call handleProcessFalse
             isBoolean="false";
             dispatch(productActions.setProcess({index,isBoolean}));
        
             console.log("removing product");
             await dispatch(fetchCartItems(userID));
           },700);
           return;
    } catch (error) {
        return  rejectWithValue(error.message);
    }
});
//async function to increase product quantity in cart items
export const increaseQuantity=createAsyncThunk("product/incQuantity",async(payload,{getState,dispatch})=>{
    const {product,userID}=payload;
    let index= -1;
    let cartItems=getState().productsReducer.cartItems;
    console.log("increase cartItems ",cartItems);
    try {
        if(cartItems.length>0){
            index=cartItems.findIndex(elem=>elem.id===product.id);
        }
        if(index!==-1){
            let newCartItems=JSON.parse(JSON.stringify(cartItems));
            newCartItems[index].quantity++;
            await updateDoc(doc(db,"cartItems",userID),
             {products:newCartItems});
             await dispatch(fetchCartItems(userID));
        }
        return "product quantity Increased!";
    } catch (error) {
        console.log(error);
    }
    
})
//async function to decrease product quantity in cart items
export const decreaseQuantity=createAsyncThunk("product/decQuantity",async(payload,{getState,dispatch})=>{
    const {product,userID}=payload;
    let index= -1;
    let cartItems=getState().productsReducer.cartItems;
    try {
        if(cartItems.length>0){
            index=cartItems.findIndex(elem=>elem.id===product.id);
        }
        if(index!==-1 && cartItems[index].quantity>1){
            let newCartItems=JSON.parse(JSON.stringify(cartItems));
            newCartItems[index].quantity--;
            await updateDoc(doc(db,"cartItems",userID),
             {products:newCartItems});
             await dispatch(fetchCartItems(userID));
             return "Product Quantity Decreased!" ;
        }else if(cartItems[index].quantity===1){
            await dispatch(removeFromCart({product,userID,index}));
           
         }
       return ;
    } catch (error) {
        console.log(error);
    }
    
});
//function to get current date after ordering
function getOrderDate(){
    const d=new Date();
    let month=d.getMonth()+1;
    let date=d.getDate();
    return d.getFullYear().toString()+"-"+(month<10?"0"+month.toString():month.toString())+"-"
    +(date<10?"0"+date.toString():date.toString());
}
//function to remove all cartitems from firestores
async function removeAllCartItems(userID){
    const docRef = doc(db, 'cartItems', userID);

    // Remove the 'capital' field from the document
    await updateDoc(docRef, {
        products: deleteField()
    });
    
}
//async function to purchase product from cart
export const purchaseProduct=createAsyncThunk("prdouct/purchase",async(payload,{rejectWithValue,dispatch})=>{
    const {cartItems,userID,totalPrice,navigate}=payload;
    const orderDate=getOrderDate();
    const createdOn=Date.now();
    const docRef = doc(db, "myOrders",userID);
    try {
        const docSnapshot = await getDoc(docRef);
    setTimeout(async()=>{
        if(docSnapshot.exists()){
            await updateDoc(doc(db,"myOrders",userID),
            {products:arrayUnion({orderDate,cartItems,totalPrice,createdOn})});
        }else{
            await setDoc(doc(db,"myOrders",userID),
            {products:arrayUnion({orderDate,cartItems,totalPrice,createdOn})});
        }
       
    },700);
    await dispatch(fetchMyOrders(userID));
    setTimeout(async()=>{
        await removeAllCartItems(userID);
        await dispatch(fetchCartItems(userID));
        dispatch(productActions.setPurchase());
        dispatch(productActions.setTotalPrice());
        navigate('/myOrders');
    },500); 
    return "total purchase items added!";
    } catch (error) {
        return  rejectWithValue(error.message);
    }
   
  
})
// Product slice creation
const productsSlice=createSlice({
    name:'product',
    initialState,
    reducers:{
        filterProducts:(state,action)=>{
            const {filterState,checkedState}=action.payload;
            console.log(action.payload);
            let filteredData =[...productsData];
           
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
            state.products=filteredData;
            state.processing=new Array(state.products.length).fill(false) 
        },
        handleSearch:(state,action)=>{  //handle search in first page
         const targetValue=action.payload;
         console.log("targetValue ",targetValue);
         let filteredProducts ;
         if(targetValue){
         filteredProducts = productsData.filter((product) =>
            product.title.toLowerCase().includes(targetValue.toLowerCase())
          );
         }else{
            filteredProducts=productsData;
         }
         return {
            ...state,
            products: filteredProducts,
            processing: new Array(filteredProducts.length).fill(false)
        }; 
        } ,
        setProcess:(state,action)=>{   
        const {index,isBoolean}=action.payload;
        const newState=[...state.processing]; //new Array(products.length).fill(false)
        
        if (index >= -1 && index < newState.length) { // Check index bounds
            newState[index] = isBoolean === "true";
            state.processing=newState;
          } else {
            console.error("Invalid index:", index);
          }
        },
        clearMsg:(state)=>{
            state.successMsg=null;
            state.errorMsg=null;
           },
        addTotalPrice:(state,action)=>{
            state.totalPrice=0;
            let cartItems=action.payload;
            if(cartItems){

            cartItems.map((item)=>{
              return state.totalPrice+=item.quantity*item.price
            })
        }
        },
        setPurchase:(state)=>{
            state.purchase=!state.purchase;
        },
        setTotalPrice:(state)=>{
            state.totalPrice=0;
        },
        setLoading:(state)=>{
            state.loading=!state.loading
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchCartItems.fulfilled,(state,action)=>{
            return{
                ...state,
                cartItems:action.payload
            }
        })
        .addCase(fetchMyOrders.fulfilled,(state,action)=>{
            return{
                ...state,
                orders:action.payload
            }
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            return{
                ...state,
                successMsg:action.payload,
                errorMsg:null
            }
        })
        .addCase(addToCart.rejected,(state,action)=>{
            return{
                ...state,
                successMsg:null,
                errorMsg:action.payload
            }
        })
        .addCase(removeFromCart.fulfilled,(state)=>{
            return{
                ...state,
                successMsg:"Product Removed Successfully!",
                errorMsg:null
            }
        })
        .addCase(removeFromCart.rejected,(state,action)=>{
            return{
                ...state,
                successMsg:null,
                errorMsg:action.payload
            }
        })
        .addCase(increaseQuantity.fulfilled,(state,action)=>{
            return{
                ...state,
                successMsg:action.payload,
                errorMsg:null
            }
        })
        .addCase(decreaseQuantity.fulfilled,(state,action)=>{

            return{
                ...state,
                successMsg:action.payload || null,
                errorMsg:null
            }
        })
        .addCase(purchaseProduct.fulfilled,(state,action)=>{
            return{
                ...state,
                successMsg:action.payload,
                errorMsg:null
            }
        })


    
        }
})
// Exporting reducer and actions
export const productsReducer=productsSlice.reducer;
export const productActions=productsSlice.actions;

// Selector to retrieve product state from the Redux store
export const productSelector=(state)=>state.productsReducer;