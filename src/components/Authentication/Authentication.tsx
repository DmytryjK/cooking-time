import { clickOptions } from "@testing-library/user-event/dist/click";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

import {useState, useEffect} from 'react';

import './Authentication.scss';

const Authentication = () => {
    const [isAuthWindowShow, setIsAuthWindowShow] = useState<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [inputMail, setInputMail] = useState<string>('');
    const [inputPass, setInputPass] = useState<string>('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            console.log('login success');
            setIsAuthorized(true);
            // Пользователь уже вошел в систему
            // Можно выполнить необходимые действия
          } else {
            console.log('try to login');
            setIsAuthorized(false);
            // Пользователь не вошел в систему
            // Можно выполнить перенаправление на страницу входа или другие действия
          }
        });
    
        return () => unsubscribe(); // Отписываемся от слушателя при размонтировании компонента
    }, []);

    useEffect(() => {
        isAuthWindowShow && setIsRegisterOpen(false);
    }, [isAuthWindowShow]);

    useEffect(() => {
        isRegisterOpen && setIsAuthWindowShow(false);
    }, [isRegisterOpen]);

    const handleCreateUser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, inputMail, inputPass)
        .then(({user}) => {
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, inputMail, inputPass)
        .then(({user}) => {
            console.log(user);
        })
        .then(res => console.log('success'))
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const handleLogOut = () => {
        signOut(auth).then(() => {
            console.log('signed out')
          }).catch((error) => {
            console.log('error when u try sign out')
          });
    }

    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMail(e.currentTarget.value);
    }

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPass(e.currentTarget.value);
    }

    const SignUp = () => {
        return (
            <div 
                className={isRegisterOpen ? "authorization active" : "authorization"} 
                onMouseDown={() => setIsRegisterOpen(false)}>
                <div 
                    className={isRegisterOpen ? "authorization__inner active" : "authorization__inner"} 
                    onMouseDown={e => e.stopPropagation()}>
                    <h2>Регистрация</h2>
                    <div className="authorization__forms-wrapper">
                        <form className="authorization__form form-login">
                            <label className="form-login__label-username">
                                <span>Электронная почта</span>
                                <div className="form-login__input-wrapper">
                                    <input 
                                        className="form-login__input-username" 
                                        type="email"
                                        onChange={handleMailChange}
                                        value={inputMail}/>
                                </div>
                            </label>
                            <label className="form-login__label-password">
                                <span>Пароль</span>
                                <div className="form-login__input-wrapper">
                                    <input      
                                        className="form-login__input-password" 
                                        type="text"
                                        onChange={handlePassChange}
                                        value={inputPass}/>
                                </div>
                            </label>
                            <button 
                                className="form-login__submit"
                                onClick={handleCreateUser}>зарегистрироваться</button>
                        </form>
                        <div className="form__divider">
                            <span>ИЛИ</span>
                        </div>
                        <div className="login__social-networks">
                            <h3 className="login__social-title">Войти как пользователь:</h3>
                            <ul className="login__social-list">
                                <li className="login__social-item">
                                    <button className="login__social-btn google">Google Account</button>
                                </li>
                                <li className="login__social-item">
                                    <button className="login__social-btn facebook">Facebook Account</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button 
                        className="authorization__signup-link"
                        onClick={() => setIsAuthWindowShow(true)}>Я уже зарегистрирован</button>
                </div>
            </div>
        )
    }

    const Login = () => {
        return (
            <div 
                className={isAuthWindowShow ? "authorization active" : "authorization"} 
                onMouseDown ={() => setIsAuthWindowShow(false)}>
                <div 
                    className={isAuthWindowShow ? "authorization__inner active" : "authorization__inner"} 
                    onMouseDown ={e => e.stopPropagation()}>
                    <h2>Вход</h2>
                    <form className="authorization__form form-login">
                        <label className="form-login__label-username">
                            <span>Электронная почта</span>
                            <div className="form-login__input-wrapper">
                                <input 
                                    className="form__input-username" 
                                    type="email"
                                    onChange={handleMailChange}
                                    value={inputMail}/>
                            </div>
                        </label>
                        <label className="form-login__label-password">
                            <span>Пароль</span>
                            <div className="form-login__input-wrapper">
                                <input      
                                    className="form-login__input-password" 
                                    type="text"
                                    onChange={handlePassChange}
                                    value={inputPass}/>
                            </div>
                        </label>
                        <button 
                            className="form-login__submit"
                            onClick={handleLogin}>Войти</button>
                    </form>
                    <button 
                        className="authorization__signup-link"
                        onClick={() => setIsRegisterOpen(true)}>Зарегестрироваться</button>
                </div>
            </div>
        )
    }

    return (
        <div className="authentication-block">
            {isAuthorized ? 
            <button onClick={handleLogOut}>Log Out</button>
            :
            <button onClick={() => setIsAuthWindowShow(!isAuthWindowShow)}>Log In</button>}
            { Login() }
            { SignUp() }
        </div>
    )
}

const LogOutBlock = () => {
    return (
        <a href="">Log Out</a>
    )
}

export default Authentication;