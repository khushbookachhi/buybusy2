import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "../../fireBaseInit";


// object sets up the initial state for the user slice 
const initialState={
    // user ID retrieved from local storage or defaults to null
    userID:localStorage.getItem('user')||null,
    loading:false,
    errorMsg:null,
    successMsg:null
}
// Function to check the authentication state
function checkAuthState(){
    console.log("checkAuthState is called");
    onAuthStateChanged(auth,(userInfo)=>{
        if(userInfo){
            console.log("user signed In");
            localStorage.setItem('user',JSON.stringify(userInfo.uid));
        }else{
            console.log("user signed out");
            localStorage.removeItem('user');
        }
    })
   
 }
 // Async thunk functions for sign up, sign in, and sign out

export const signUpAsync=createAsyncThunk("user/signUp",async(payload,{rejectWithValue})=>{
    try {
       
        const userCredential= await createUserWithEmailAndPassword(auth,payload.email,payload.password);
        await updateProfile(userCredential.user,{displayName:payload.name}) 
        console.log(userCredential.user);
        return userCredential.user.uid;
    } catch (error) {
        return rejectWithValue(error.message);
    }
            
})
export const signInAsync=createAsyncThunk("user/signIn",async(payload,{rejectWithValue})=>{
    try {
        const userCredential= await signInWithEmailAndPassword(auth,payload.email,payload.password);
        checkAuthState();
        return userCredential.user.uid;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
export const signOutAsync=createAsyncThunk("user/signOut",async(_,{rejectWithValue})=>{
    try {
        await signOut(auth);
        checkAuthState();
        return "User Signed Out!";
    } catch (error) {
        return rejectWithValue(error.message);
    }
  
})
// User slice creation
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        clearMsg:(state)=>{ // Action to clear success and error messages
         state.successMsg=null;
         state.errorMsg=null;
        }
    },
    extraReducers:(builder)=>{
     builder.addCase(signUpAsync.pending,(state)=>{
        return{
            ...state,
            errorMsg:null,
            loading:true
        }
     })
     .addCase(signUpAsync.fulfilled,(state)=>{
        console.log("User Signed Up Successfully!");
        return{
            ...state,
            loading:false,
           successMsg:"User Signed Up Successfully!",
           errorMsg:null
     }
       
     })
     .addCase(signUpAsync.rejected,(state,action)=>{
        const {payload}=action;
        const errorMessage = typeof payload === 'string' ? payload : 'Error:Check Credential!';
        return{
            ...state,
            successMsg:null,
            errorMsg:errorMessage,
            loading:false,
        }  
       
     })
     .addCase(signInAsync.fulfilled,(state,action)=>{
        return{
            ...state,
            userID:action.payload,
            successMsg:"User Signed In Successfully!",
            errorMsg:null,
            loading:false,
        }
     })
     .addCase(signInAsync.rejected,(state,action)=>{
        const {payload}=action;
        const errorMessage = typeof payload === 'string' ? payload : 'Error:Check Credential!';
        return{
            ...state,
            successMsg:null,
            errorMsg:errorMessage,
            loading:false,
        }
     })
     .addCase(signOutAsync.fulfilled,(state,action)=>{
      return{
        ...state,
        userID:null,
        successMsg:action.payload,
        errorMsg:null
      }
     })
     .addCase(signOutAsync.rejected,(state,action)=>{
        const {payload}=action;
        const errorMessage = typeof payload === 'string' ? payload : 'Error:In User Sign Out!';
        return{
          ...state,
          successMsg:null,
          errorMsg:errorMessage
        }
       })
    }
})
// Exporting reducer and actions
export const userReducer=userSlice.reducer;
export const actions=userSlice.actions;

// Selector to retrieve user state from the Redux store
export const userSelector=(state)=>state.userReducer;