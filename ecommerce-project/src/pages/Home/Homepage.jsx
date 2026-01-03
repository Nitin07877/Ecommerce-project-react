import axios from'axios'
import { useEffect,useState } from 'react';
import { Header } from '../../components/Header';


import { ProductGrid } from './ProductsGrid';


import './HomePage.css';
export function HomePage({cart}) {
    const[products,setProducts] =useState([]);
    useEffect(()=>{
        axios.get('/api/products')
            .then((response)=>{
                setProducts(response.data)
            });
                
    },[]);
    
    
    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
            <Header cart={cart}/>

            <div className="home-page">
                <ProductGrid products={products}/>
            </div>
        </>


    );
}