import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LazyLoad from 'react-lazy-load';
import Authentication from './components/Authentication/Authentication';
import Logo from '../../assets/icons/logo.svg';
import './AuthorizationPage.scss';

type AuthorizationPageProps = {
    register?: boolean;
    login?: boolean;
};

const AuthorizationPage = (props: AuthorizationPageProps) => {
    const { register, login } = props;
    const navigate = useNavigate();
    return (
        <motion.section
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
                <Authentication register={register} login={login} />
            </div>
        </motion.section>
    );
};

export default AuthorizationPage;
