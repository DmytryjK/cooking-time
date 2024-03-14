import { useEffect, useState, Suspense } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import LazyLoaderPage from '../../shared-components/Loader/LazyLoaderPage/LazyLoaderPage';
import './Layout.scss';

const Layout = () => {
    const [isSearchActive, setIsSearchActive] = useState(true);
    const { pathname } = useLocation();
    useEffect(() => {
        if (pathname === '/' || pathname === '/favorites') {
            setIsSearchActive(true);
        } else {
            setIsSearchActive(false);
        }
    }, [pathname]);
    return (
        <div className={`layout ${isSearchActive ? '' : 'search-disable'}`}>
            <Header />
            <Suspense fallback={<LazyLoaderPage />}>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};

export default Layout;
