import './App.css';
import Header from "./component/layout/Header/Header.jsx";
import {BrowserRouter as Router, Route,Switch} from "react-router-dom"
import webFont from "webfontloader"
import React, { useState,useEffect } from 'react';
import Footer from "./component/layout/Footer/Footer.jsx";
import Home from "./component/Home/Home.jsx";
import ProductDetails from "./component/Product/ProductDetails.jsx";
import Products from "./component/Product/Products.jsx";
import Search from "./component/Product/Search.jsx";
import LoginSignUp from './component/User/LoginSignUp';
 import Contact from "./component/layout/Contact/Contact.jsx";
import About from "./component/layout/About/About.jsx";
import store from "./Store";
import { loadUser } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.jsx";
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.jsx";
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.jsx";
import UpdatePassword from "./component/User/UpdatePassword.jsx";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword.jsx";
import Cart from "./component/Cart/Cart.jsx";
import Shipping from "./component/Cart/Shipping.jsx";
import ConfirmOrder from "./component/Cart/ConfirmOrder.jsx";
import axios from "axios";
import Payment from "./component/Cart/Payment.jsx";
 import { Elements } from "@stripe/react-stripe-js";
 import { loadStripe } from "@stripe/stripe-js";
 import OrderSuccess from "./component/Cart/OrderSuccess.jsx";
 import MyOrders from "./component/Order/MyOrders.jsx";
import OrderDetails from "./component/Order/OrderDetails.jsx";
 import Dashboard from "./component/Admin/Dashboard.jsx";
 import ProductList from "./component/Admin/ProductList.jsx";
 import NewProduct from "./component/Admin/NewProduct.jsx";
 import UpdateProduct from "./component/Admin/UpdateProduct.jsx";
 import OrderList from "./component/Admin/OrderList.jsx";
 import ProcessOrder from "./component/Admin/ProcessOrder.jsx";
import UsersList from "./component/Admin/UsersList.jsx";
 import UpdateUser from "./component/Admin/UpdateUser.jsx";
 import ProductReviews from "./component/Admin/ProductReviews.jsx";
 import NotFound from "./component/layout/Not Found/NotFound.jsx";



function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  };


  useEffect(()=>{
    webFont.load({
     google:{
      families:["Roboto","Droid","Chilanka"]
     },
    });

   store.dispatch(loadUser());
   getStripeApiKey();

  },[])

   window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (

    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user}/>}
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}

       <Switch>

        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route  path="/products/:keyword" component={Products} />
        <Route  exact path="/search" component={Search} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/about"  component={About} />
        
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        
        <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
        />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />


        <Route exact path="/login" component={LoginSignUp} />
        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/shipping" component={Shipping} />

  <ProtectedRoute exact path="/success" component={OrderSuccess} />
  <ProtectedRoute exact path="/orders" component={MyOrders} />

  <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
  <ProtectedRoute exact path="/order/:id" component={OrderDetails} /> 
 

  <ProtectedRoute isAdmin={true} exact path="/admin/dashboard"component={Dashboard} />

  <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ProductList} />
       
        <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        />
        
        <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />
        
        <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
        />

        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />


        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />

        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />

        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        /> 

      <Route path='*' element={window.location.pathname === "/process/payment" ? null : <NotFound/>}/>

       </Switch>
      <Footer/>
    </Router>

  );
}

export default App;
