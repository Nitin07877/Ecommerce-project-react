import {Routes,Route} from 'react-router'
import { HomePage } from './pages/Homepage'
import { CheckoutPage } from './pages/CheckoutPage'

import './App.css'

function App() {
  

  return (
    <>
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='checkout' element={<CheckoutPage/>}/>

      
    </Routes>
      
      
    </>
  )
}

export default App
