import {Header} from '../components/Header';
import './NotFoundPage.css'
export function NotFoundPage (){
    return(
        <>
        <title>404 Page Not Found</title>
        <link rel="icon" type="image/svg+xml" href="error-favicon.png" />
        <Header/>
        <div className="not-found-message">
            <p>Page not found!</p>
        </div>
        </>
    );
}