import {FC} from 'react';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, reload, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useState, useEffect, useRef } from 'react';
import { createUser } from "../../../../store/reducers/AuthenticationSlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";

import './Authentication.scss';

const Authentication: FC = () => {
    const navigate = useNavigate();

    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [inputMail, setInputMail] = useState<string>('sdfasdfgs');
    const [inputPass, setInputPass] = useState<string>('');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const loginByEmailPassInput = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        if (localStorage.getItem('user')) navigate("/");
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthorized(true);
                if (user.uid && user.email) {
                    const userToSave = { uid: user.uid, email: user.email };
                    localStorage.setItem('user', JSON.stringify(userToSave));
                    dispatch(createUser(userToSave));
                }
            } else {
                localStorage.clear();
                console.log('try to login');
                setIsAuthorized(false);
            }
            setInputMail('');
            setInputPass('');
        });
      
        return () => {
          unsubscribe(); // Отписываемся от слушателя при размонтировании компонента
        };
    }, []);

    const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, inputMail, inputPass)
            .then(({user}) => {
                navigate('/');
                setIsRegisterOpen(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        signInWithEmailAndPassword(auth, inputMail, inputPass)
            .then(({user}) => {
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const authWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                setIsRegisterOpen(false);
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    };

    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMail(e.currentTarget.value);
    }

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPass(e.currentTarget.value);
    }

    const handleHidePass = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (loginByEmailPassInput.current) {
            loginByEmailPassInput.current.type === 'password' ? loginByEmailPassInput.current.type = 'text' : loginByEmailPassInput.current.type = 'password';
        } 
    }

    const ChoiceAuthWindow = () => {
        return (
            <>
                {/* LoginPage */}
                <div className={isRegisterOpen ? "authentication__block login" : "authentication__block login active"}>
                    <h1 className="authentication__block-title">Увійти</h1>
                    <div className="authentication__block-list">
                        <form 
                            className="authorization__window-form form-email"
                            onSubmit={handleLogin}>
                            <div className="form-email__label-wrapper">
                                <label className="form-email__label">
                                    <span>Ваша електронна пошта</span>
                                    <div className="form-email__input-wrapper">
                                        <input 
                                            className="form-email__input" 
                                            type="email"
                                            name="email"
                                            autoComplete="current-email"
                                            required
                                            placeholder="youremail@example.com"
                                            onChange={handleMailChange}
                                            value={inputMail}/>
                                    </div>
                                </label>
                            </div>
                            <div className="form-email__label-wrapper">
                                <label className="form-email__label">
                                    <span>Ваш пароль</span>
                                    <div className="form-email__input-wrapper input-password__wrapper">
                                        <input      
                                            className="form-email__input input-password" 
                                            type="password"
                                            name="password"
                                            autoComplete="current-password"
                                            required
                                            placeholder="&#10625; &#10625; &#10625; &#10625; &#10625; &#10625; &#10625;"
                                            onChange={handlePassChange}
                                            value={inputPass}
                                            ref={loginByEmailPassInput}/>
                                        <button 
                                        className="input-password__hide-btn" 
                                        title="hide-show password"
                                        onClick={(e) => handleHidePass(e)}></button>
                                    </div>
                                </label>
                            </div>
                            <div className="form-email__label-wrapper remeber-me__wrapper"> 
                                <label className="form-email__label remeber-me__label">
                                    <input      
                                        className="form-email__checkbox" 
                                        type="checkbox"
                                        name="stay loged in"/>
                                    <span className="remeber-me__checkbox-default"></span>
                                    <span className="remeber-me__checkbox-checked"></span>
                                    <span>Запам'ятати мене</span>
                                </label>
                            </div>
                            <button className="form-email__submit" type="submit">Увійти</button>
                        </form>
                    </div>
                    <div className="authentication__change-form">
                        <span>Не маєте аккаунта?</span>
                        <button onClick={() => setIsRegisterOpen(true)}>Зареєструйтесь</button>
                    </div>
                    <div className="authentication__decorative-block"><span className="text">або</span></div>
                    <button 
                        className="authentication__block-btn"
                        onClick={authWithGoogle}>
                        <span className="authentication__block-text">
                            Продовжити через Google
                            <span className="authentication__block-decorative block-google"></span>
                        </span>
                    </button>
                </div>
                {/* RegisterPage */}
                <div className={isRegisterOpen ? "authentication__block register active" : "authentication__block register"}>
                    <h1 className="authentication__block-title">Зареєструватись</h1>
                    <div className="authentication__block-list">
                        <form 
                            className="authorization__window-form form-email"
                            onSubmit={handleCreateUser}>
                            <div className="form-email__label-wrapper">
                                <label className="form-email__label">
                                    <span>Ваша електронна пошта</span>
                                    <div className="form-email__input-wrapper">
                                        <input 
                                            className="form-email__input" 
                                            type="email"
                                            name="email"
                                            autoComplete="current-email"
                                            required
                                            placeholder="youremail@example.com"
                                            onChange={handleMailChange}
                                            value={inputMail}/>
                                    </div>
                                </label>
                            </div>
                            <div className="form-email__label-wrapper">
                                <label className="form-email__label">
                                    <span>Ваш пароль</span>
                                    <div className="form-email__input-wrapper input-password__wrapper">
                                        <input      
                                            className="form-email__input input-password" 
                                            type="password"
                                            name="password"
                                            autoComplete="current-password"
                                            required
                                            placeholder="&#10625; &#10625; &#10625; &#10625; &#10625; &#10625; &#10625;"
                                            onChange={handlePassChange}
                                            value={inputPass}
                                            ref={loginByEmailPassInput}/>
                                        <button 
                                        className="input-password__hide-btn" 
                                        title="hide-show password"
                                        onClick={(e) => handleHidePass(e)}></button>
                                    </div>
                                </label>
                            </div>
                            <div className="form-email__label-wrapper remeber-me__wrapper"> 
                                <label className="form-email__label remeber-me__label">
                                    <input      
                                        className="form-email__checkbox" 
                                        type="checkbox"
                                        name="stay loged in"/>
                                    <span className="remeber-me__checkbox-default"></span>
                                    <span className="remeber-me__checkbox-checked"></span>
                                    <span>Запам'ятати мене</span>
                                </label>
                            </div>
                            <button className="form-email__submit" type="submit">Зареєструватись</button>
                        </form>
                    </div>
                    <div className="authentication__change-form">
                        <span>Маєте аккаунт?</span>
                        <button onClick={() => setIsRegisterOpen(false)}>Увійти</button>
                    </div>
                    <div className="authentication__decorative-block"><span className="text">або</span></div>
                    <button 
                        className="authentication__block-btn"
                        onClick={authWithGoogle}>
                        <span className="authentication__block-text">
                            Продовжити через Google
                            <span className="authentication__block-decorative block-google"></span>
                        </span>
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className="authentication__wrapper">
            {ChoiceAuthWindow()}
        </div>
    )
}

export default Authentication;
