import { configureStore} from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducers";
import { productsReducer } from "./reducers/productsReducers";



// Configure the Redux store
export const store = configureStore({
    // Combine multiple reducers into a single reducer object
    reducer: {
        userReducer, // User reducer
        productsReducer // Products reducer
    }
});