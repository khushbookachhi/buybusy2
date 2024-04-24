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
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Nav />,
      children: [
        {index:true,element:<Products/>},
        {path:'/signin',element:<SignIn/>},
        {path:'/signup',element:<SignUp/>},
        {path:'/myOrders',element:<MyOrder/>},
        {path:'/cart',element:<Cart/>},
      ]
    }
  ])
  return (
    <>
     <Provider store={store}>
     <RouterProvider router={browserRouter} />
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false}
                      newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss
                      draggable pauseOnHover />
     </Provider>
     
    
    </>
  );
}

export default App;
