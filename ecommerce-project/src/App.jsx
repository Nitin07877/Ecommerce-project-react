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
  useEffect(() => {
    const fetchAppData= async ()=>{
      const response=await axios.get('/api/cart-items?expand=product')
        setcart(response.data)
    };
    fetchAppData();
  }, []);


  return (
    <>
      <Routes>
        <Route index element={<HomePage cart={cart} />} />
        <Route path='checkout' element={<CheckoutPage cart={cart}/>} />
        <Route path='orders' element={<OrdersPage cart={cart} />} />
        <Route path='tracking' element={<TrackingPage />} />
        <Route path='*' element={<NotFoundPage />} />


      </Routes>


    </>
  )
}

export default App
