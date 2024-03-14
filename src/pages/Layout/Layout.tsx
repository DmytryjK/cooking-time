import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';
import './Layout.scss';

const Layout = () => {
    return (
        <div className="layout">
            <Header />
            <Suspense>
                <Outlet />
            </Suspense>
            <Footer />
        </div>
    );
};

export default Layout;
