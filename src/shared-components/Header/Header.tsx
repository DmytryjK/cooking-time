import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { NavLink, useLocation } from 'react-router-dom';
import SearchForm from './SearchForm/SearchForm';
import { auth } from '../../firebase/firebase';
import { createUser } from '../../store/reducers/AuthenticationSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import logo from '../../assets/icons/logo.svg';
import './Header.scss';

const Header = () => {
    const { uid } = useAppSelector((state) => state.authentication.user);
    const [userAuthToLocalStorage, setUserAuthToLocalStorage] = useState<
        string | null
    >(null);
    const [isShouldRenderSearch, setIsShouldRenderSearch] = useState(true);

    const dispatch = useAppDispatch();
    const savedUser = localStorage.getItem('user');
    const { pathname } = useLocation();

    useEffect(() => {
        setUserAuthToLocalStorage(savedUser);
    }, [savedUser]);

    useEffect(() => {
        if (pathname === '/' || pathname === '/favorites') {
            setIsShouldRenderSearch(true);
        } else {
            setIsShouldRenderSearch(false);
        }
    }, [pathname]);

    useEffect(() => {
        if (!uid && savedUser) {
            dispatch(createUser(JSON.parse(savedUser)));
        }
    }, [uid, savedUser, dispatch]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('logout success');
                localStorage.clear();
                setUserAuthToLocalStorage(null);
                dispatch(createUser({ uid: '', email: '' }));
            })
            .catch((error) => {
                console.log('error when u try sign out');
            });
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__wrapper">
                    <div className="header__left">
                        <NavLink
                            to="/"
                            reloadDocument
                            className={({ isActive }) =>
                                isActive
                                    ? 'header__logo active'
                                    : 'header__nav-link'
                            }
                        >
                            <img width={100} height={54} src={logo} alt="" />
                        </NavLink>
                        <nav className="header__nav">
                            <ul className="header__nav-list">
                                <li className="header__nav-item">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                    >
                                        Головна
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/favorites"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                    >
                                        Обране
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/add-recipe"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                    >
                                        Додати рецепт
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header__right">
                        {isShouldRenderSearch ? <SearchForm /> : null}
                        {userAuthToLocalStorage ? (
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="logout__btn"
                            >
                                Вийти
                            </button>
                        ) : (
                            <NavLink
                                className="login__link"
                                to="/auth-login"
                                reloadDocument
                            >
                                {' '}
                                Увійти | Зареєструватись
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
