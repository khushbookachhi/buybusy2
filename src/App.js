import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from "./components/nav/Nav";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/signup/SignUp";
import Products from "./pages/products/products";
import MyOrder from "./pages/orders/myOrder";
import Cart from "./pages/cart/Cart";
import { store } from "./redux/store";
function App() {
   // Create a custom browser router configuration
  const browserRouter = createBrowserRouter([
    {   // Define the root route '/'
      path: '/',
      element: <Nav />, // Render the Nav component
      children: [
        { index: true, element: <Products /> }, // Render the Products component when the root route is accessed
        { path:'/signin', element: <SignIn /> }, // Render the SignIn component when '/signin' route is accessed
        { path:'/signup', element: <SignUp /> }, // Render the SignUp component when '/signup' route is accessed
        { path:'/myOrders', element: <MyOrder /> }, // Render the MyOrder component when '/myOrders' route is accessed
        { path:'/cart', element: <Cart /> }, // Render the Cart component when '/cart' route is accessed
      ]
    }
  ])
  return (
    <>    {/* Provide the Redux store to the entire application */}
     <Provider store={store}>
         {/* Provide the custom browser router configuration to the application */}
     <RouterProvider router={browserRouter} />
      {/* ToastContainer to display toast notifications for user feedback */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false}
                      newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss
                      draggable pauseOnHover />
     </Provider>
     
    
    </>
  );
}

export default App;
