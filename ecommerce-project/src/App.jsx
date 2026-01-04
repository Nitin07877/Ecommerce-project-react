import { Routes, Route } from 'react-router'
import { HomePage } from './pages/Home/Homepage'
import { CheckoutPage } from './pages/Checkout/CheckoutPage'
import { OrdersPage } from './pages/orders/OrdersPage'
import { TrackingPage } from './pages/TrackingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import axios from 'axios'
import { useState,useEffect } from 'react'
import './App.css'


function App() {
  const [cart, setcart] = useState([]);
  const loadCart= async ()=>{
    const response=await axios.get('/api/cart-items?expand=product')
      setcart(response.data)
  };
  useEffect(() => {
    loadCart();
  }, []);


  return (
    <>
      <Routes>
        <Route index element={<HomePage cart={cart} loadCart={loadCart} />} />
        <Route path='checkout' element={<CheckoutPage cart={cart} loadCart={loadCart}/>} />
        <Route path='orders' element={<OrdersPage cart={cart} />} />
        <Route path='tracking/:orderId/:productId' element={<TrackingPage cart={cart}/>} />
        <Route path='*' element={<NotFoundPage cart={cart} />} />


      </Routes>


    </>
  )
}

export default App
