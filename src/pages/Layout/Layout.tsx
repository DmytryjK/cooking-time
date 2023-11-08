import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <>
            <Header isSearch />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
