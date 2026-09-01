import { NavLink, useNavigate, useSearchParams } from 'react-router';
import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/logo-white.png';
import MobileLogoWhite from '../assets/images/mobile-logo-white.png';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './header.css';

export function Header({ cart = [] }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, logout } = useAuth();

    const searchText = searchParams.get('search');
    const [search, setSearch] = useState(searchText || '');

    const updateSearchInput = (event) => {
        setSearch(event.target.value);
    };

    const searchProducts = () => {
        navigate(`/?search=${search}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });

    return (
        <div className="header">

            {/* LEFT - LOGO */}
            <div className="left-section">
                <NavLink to="/" className="header-link">
                    <img
                        className="logo"
                        data-testid="header-logo"
                        src={LogoWhite}
                    />

                    <img
                        className="mobile-logo"
                        data-testid="header-mobile-logo"
                        src={MobileLogoWhite}
                    />
                </NavLink>
            </div>

            {/* SEARCH */}
            <div className="middle-section">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={updateSearchInput}
                    data-testid="header-search-bar"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            searchProducts();
                        }
                    }}
                />

                <button
                    className="search-button"
                    onClick={searchProducts}
                    data-testid="header-search-button"
                >
                    <img
                        className="search-icon"
                        src={SearchIcon}
                    />
                </button>
            </div>

            {/* RIGHT */}
            <div className="right-section">

                {user ? (
                    <>
                        <div className="user-greeting">
                            Hi, {user.name}
                        </div>

                        <NavLink
                            className="orders-link header-link"
                            to="/orders"
                            data-testid="header-orders-link"
                        >
                            <span className="orders-text">
                                Orders
                            </span>
                        </NavLink>

                        <NavLink
                            className="cart-link header-link"
                            to="/checkout"
                            data-testid="header-cart-link"
                        >
                            <img
                                className="cart-icon"
                                src={CartIcon}
                            />

                            <div className="cart-quantity">
                                {totalQuantity}
                            </div>

                            <div className="cart-text">
                                Cart
                            </div>
                        </NavLink>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            className="auth-header-link header-link"
                            to="/login"
                        >
                            Login
                        </NavLink>

                        <NavLink
                            className="auth-header-link header-link"
                            to="/register"
                        >
                            Register
                        </NavLink>

                        <NavLink
                            className="cart-link header-link"
                            to="/checkout"
                            data-testid="header-cart-link"
                        >
                            <img
                                className="cart-icon"
                                src={CartIcon}
                            />

                            <div className="cart-quantity">
                                {totalQuantity}
                            </div>

                            <div className="cart-text">
                                Cart
                            </div>
                        </NavLink>
                    </>
                )}

            </div>
        </div>
    );
}