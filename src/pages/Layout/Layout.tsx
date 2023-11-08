import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../shared-components/Header/Header';
import Footer from '../../shared-components/Footer/Footer';

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const body = document.querySelector('body');
        let isScroll = false;
        if (!body) return;
        const checkHeight = () => {
            if (
                document.body.offsetHeight < window.innerHeight ||
                document.body.offsetHeight >
                    document.documentElement.clientHeight
            ) {
                isScroll = true;
            } else {
                isScroll = false;
            }
        };
        checkHeight();
        if (isScroll) {
            body.style.cssText = 'margin-right: -8px; overflow-x: hidden';
        } else {
            body.style.cssText = 'margin-right: 0; overflow: auto';
        }
        window.addEventListener('resize', () => {
            checkHeight();
        });
    }, [pathname]);

    return (
        <>
            <Header isSearch />
            {children}
            <Footer />
        </>
    );
};

export default Layout;
