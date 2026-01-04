import {Header} from '../components/Header';
import './NotFoundPage.css'
export function NotFoundPage ({cart}){
    return(
        <>
        <title>404 Page Not Found</title>
        <link rel="icon" type="image/svg+xml" href="error-favicon.png" />
        <Header cart={cart}/>
        <div className="not-found-message">
            <p>Page not found!</p>
        </div>
        </>
    );
}