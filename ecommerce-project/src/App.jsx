import {Routes,Route} from 'react-router'
import { HomePage } from './pages/Homepage'
import { CheckoutPage } from './pages/Checkout/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { TrackingPage } from './pages/TrackingPage'
import { NotFoundPage } from './pages/NotFoundPage'

import './App.css'


function App() {
  

  return (
    <>
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='checkout' element={<CheckoutPage/>}/>
      <Route path='orders' element={<OrdersPage/>}/>
      <Route path='tracking' element={<TrackingPage/>}/>
      <Route path='*' element={<NotFoundPage/>}/>

      
    </Routes>
      
      
    </>
  )
}

export default App
