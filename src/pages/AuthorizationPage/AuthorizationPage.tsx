import { NavLink, useNavigate } from 'react-router-dom';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import LazyLoad from 'react-lazy-load';
import Authentication from './components/Authentication/Authentication';
import Logo from '../../assets/icons/logo.svg';
import './AuthorizationPage.scss';

type AuthorizationPageProps = {
    register?: boolean;
    login?: boolean;
    forgotPassword?: boolean;
    authResponse?: boolean;
};

const AuthorizationPage = (props: AuthorizationPageProps) => {
    const { register, login, forgotPassword, authResponse } = props;
    const navigate = useNavigate();
    return (
        <LazyMotion strict features={domAnimation}>
            <m.section
                className="authorization"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        delay: 0,
                    },
                }}
                exit={{
                    opacity: 0,
                    display: 'none',
                }}
            >
                <LazyLoad>
                    <div className="authorization__image" />
                </LazyLoad>
                <div className="authorization__content">
                    <nav className="authorization__nav">
                        <NavLink className="authorization__logo" to="/">
                            <img src={Logo} alt="" />
                        </NavLink>
                        <NavLink
                            className="authorization__nav-link"
                            to="#"
                            onClick={() => navigate(-1)}
                        >
                            Назад
                        </NavLink>
                    </nav>
                    <Authentication
                        register={register}
                        login={login}
                        forgotPassword={forgotPassword}
                        authResponse={authResponse}
                    />
                </div>
            </m.section>
        </LazyMotion>
    );
};

export default AuthorizationPage;
