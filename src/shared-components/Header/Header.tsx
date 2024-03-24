import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { NavLink, useLocation } from 'react-router-dom';
import SearchForm from './SearchForm/SearchForm';
import { auth } from '../../firebase/firebase';
import { createUser } from '../../store/reducers/AuthenticationSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { resetFavoriteRecipes } from '../../store/reducers/FavoritesRecipesSlice';
import { resetRecipes } from '../../store/reducers/RecipesListSlice';
import logo from '../../assets/icons/logo.svg';
import BurgerBtn from './BurgerBtn/BurgerBtn';
import './Header.scss';

const Header = () => {
    const { uid, email, emailVerified } = useAppSelector(
        (state) => state.authentication.user
    );
    const [userAuthToLocalStorage, setUserAuthToLocalStorage] = useState<
        string | null
    >(null);
    const [isShouldRenderSearch, setIsShouldRenderSearch] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

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
                dispatch(
                    createUser({ uid: '', email: '', emailVerified: null })
                );
                dispatch(resetFavoriteRecipes());
                dispatch(resetRecipes());
            })
            .catch((error) => {
                console.log('error when u try sign out');
            });
    };

    return (
        <header
            className={`header ${
                isShouldRenderSearch ? '' : 'search-disabled'
            }`}
        >
            <div className="container">
                <div className="header__wrapper">
                    <div className="header__left">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'header__logo active'
                                    : 'header__logo'
                            }
                            onClick={() => setIsBurgerOpen(false)}
                        >
                            <img width={100} height={54} src={logo} alt="" />
                        </NavLink>
                        <nav
                            className={`header__nav ${
                                isBurgerOpen ? 'mobile-active' : ''
                            }`}
                        >
                            <ul className="header__nav-list">
                                <li className="header__nav-item">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                        onClick={() => setIsBurgerOpen(false)}
                                    >
                                        Головна
                                    </NavLink>
                                </li>
                                <li className="header__nav-item">
                                    <NavLink
                                        to="/favorites"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                        onClick={() => setIsBurgerOpen(false)}
                                    >
                                        Обране
                                    </NavLink>
                                </li>
                                <li className="header__nav-item">
                                    <NavLink
                                        to="/add-recipe"
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'header__nav-link active'
                                                : 'header__nav-link'
                                        }
                                        onClick={() => setIsBurgerOpen(false)}
                                    >
                                        Додати рецепт
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header__right">
                        {isShouldRenderSearch ? <SearchForm /> : null}
                        {email && (
                            <span className="header__right-username">
                                Вітаємо,
                                <strong>
                                    {email.substring(0, email.indexOf('@'))}
                                </strong>
                            </span>
                        )}
                        {userAuthToLocalStorage ? (
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="logout__btn"
                            >
                                Вийти
                            </button>
                        ) : (
                            <NavLink className="login__link" to="/auth-login">
                                {' '}
                                Увійти | Зареєструватись
                            </NavLink>
                        )}
                        <BurgerBtn
                            isBurgerOpen={isBurgerOpen}
                            setIsBurgerOpen={setIsBurgerOpen}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
