import { configureStore} from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducers";
import { productsReducer } from "./reducers/productsReducers";





export const store=configureStore({
    reducer:{
       userReducer,
       productsReducer
    }
});