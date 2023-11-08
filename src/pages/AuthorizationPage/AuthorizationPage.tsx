import { NavLink, useNavigate } from 'react-router-dom';
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
        <section className="authorization">
            <div className="authorization__image" />
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
        </section>
    );
};

export default AuthorizationPage;
