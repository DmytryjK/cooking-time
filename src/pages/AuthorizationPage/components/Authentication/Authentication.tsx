import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import nextId from 'react-id-generator';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut,
} from 'firebase/auth';
import { createUser } from '../../../../store/reducers/AuthenticationSlice';
import { useAppDispatch } from '../../../../hooks/hooks';
import AuthLogin from './AuthLogin/AuthLogin';
import AuthRegister from './AuthRegister/AuthRegister';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import AuthResponse from './AuthResponse/AuthResponse';
import './Authentication.scss';
import { resetFavoriteRecipes } from '../../../../store/reducers/FavoritesRecipesSlice';

type AuthorizationPageProps = {
    register?: boolean;
    login?: boolean;
    forgotPassword?: boolean;
    authResponse?: boolean;
};

export type TextActions = {
    text: (string | JSX.Element)[];
    status: 'SUCCESS' | 'WARNING' | '';
};

const Authentication: FC<AuthorizationPageProps> = ({
    register,
    login,
    forgotPassword,
    authResponse,
}) => {
    const navigate = useNavigate();
    const { pathname, key, search, state } = useLocation();
    const isFirstPage = key === 'default';
    const [inputMail, setInputMail] = useState<string>('');
    const [inputPass, setInputPass] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStateTextActionChange, setIsStateTextActionChange] =
        useState(true);
    const loginByEmailPassInput = useRef<HTMLInputElement>(null);
    const signUpByEmailPassInput = useRef<HTMLInputElement>(null);
    const [textActions, setTextActions] = useState<TextActions>({
        text: [''],
        status: '',
    });

    const dispatch = useAppDispatch();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const resetAuthForm = useCallback(() => {
        if (inputMail) {
            setInputMail('');
        }
        if (inputPass) {
            setInputPass('');
        }
    }, [inputMail, inputPass]);

    useEffect(() => {
        if (localStorage.getItem('user')) navigate('/');
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.uid && user.email && user.emailVerified) {
                    const { uid, email, emailVerified } = user;
                    const userToSave = { uid, email, emailVerified };
                    localStorage.setItem('user', JSON.stringify(userToSave));
                    dispatch(createUser(userToSave));
                }
            } else {
                localStorage.clear();
            }
        });

        return () => {
            unsubscribe(); // Remove listener for state change
        };
    }, []);

    useEffect(() => {
        if (
            textActions.text &&
            isStateTextActionChange &&
            pathname !== '/auth-response'
        ) {
            setTextActions({
                text: [''],
                status: '',
            });
        } else {
            setIsStateTextActionChange(true);
        }
    }, [pathname]);

    const handleCreateUser = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsLoading(true);
            createUserWithEmailAndPassword(auth, inputMail, inputPass)
                .then(({ user }) => {
                    sendEmailVerification(user).then(() => {
                        setTextActions({
                            text: [
                                'На вашу пошту',
                                <b key={nextId('bold')}>{user.email}</b>,
                                'був відправлений лист для верифікації',
                            ],
                            status: 'SUCCESS',
                        });
                        signOut(auth);
                        resetAuthForm();
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/email-already-in-use') {
                        setTextActions({
                            text: [`Даний емейл вже зареєстрований на сайті`],
                            status: 'WARNING',
                        });
                    }
                    if (errorCode === 'auth/invalid-email') {
                        setTextActions({
                            text: [
                                'Введіть коректний емейл для реєстрації, наприклад:',
                                <b key={nextId('bold')}>email@example.com</b>,
                            ],
                            status: 'WARNING',
                        });
                    }
                    if (errorCode === 'auth/weak-password') {
                        setTextActions({
                            text: [
                                `Пароль закороткий, введіть мінімум 6 символів`,
                            ],
                            status: 'WARNING',
                        });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [inputMail, inputPass]
    );

    const handleLogin = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsLoading(true);
            signInWithEmailAndPassword(auth, inputMail, inputPass)
                .then(({ user }) => {
                    if (!user.emailVerified) {
                        signOut(auth);
                        throw new Error('unverified-user');
                    }
                    resetAuthForm();
                    dispatch(resetFavoriteRecipes());
                    navigate('/');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/invalid-login-credentials') {
                        setTextActions({
                            text: [`Невірно введені логін або пароль`],
                            status: 'WARNING',
                        });
                    }
                    if (errorCode === 'auth/too-many-requests') {
                        setTextActions({
                            text: [
                                `Ви здійснили багато запитів на авторизацію, почекайте декілька хвилин`,
                            ],
                            status: 'WARNING',
                        });
                    }
                    if (errorMessage === 'unverified-user') {
                        setTextActions({
                            text: [
                                'Для входу - верифікуйте свій емейл:',
                                <b key={nextId('bold')}>
                                    {auth.currentUser?.email}
                                </b>,
                                'за посиланням на пошті',
                            ],
                            status: 'WARNING',
                        });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [inputMail, inputPass]
    );

    const handleResetPassword = useCallback(
        (e: React.MouseEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsLoading(true);
            sendPasswordResetEmail(auth, inputMail)
                .then((res) => {
                    setTextActions({
                        text: [
                            'Лист з посиланням на відновлення паролю успішно надісланий на електронну пошту:',
                            <b key={nextId('bold')}>{inputMail}</b>,
                        ],
                        status: 'SUCCESS',
                    });
                    resetAuthForm();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/invalid-email') {
                        setTextActions({
                            text: [
                                `Користувач з такою поштою не зареєстрований`,
                            ],
                            status: 'WARNING',
                        });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [inputMail]
    );

    const authWithGoogle = useCallback(() => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const { user } = result;
                dispatch(resetFavoriteRecipes());
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const { email } = error.customData;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
            });
    }, []);

    const handleMailChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputMail(e.currentTarget.value);
            if (textActions.text) {
                setTextActions({
                    text: [''],
                    status: '',
                });
            }
        },
        [textActions]
    );

    const handlePassChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputPass(e.currentTarget.value);
            if (textActions.text) {
                setTextActions({
                    text: [''],
                    status: '',
                });
            }
        },
        [textActions]
    );

    const handleHidePass = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (loginByEmailPassInput.current) {
                if (loginByEmailPassInput.current.type === 'password') {
                    loginByEmailPassInput.current.type = 'text';
                } else {
                    loginByEmailPassInput.current.type = 'password';
                }
            }
            if (signUpByEmailPassInput.current) {
                if (signUpByEmailPassInput.current.type === 'password') {
                    signUpByEmailPassInput.current.type = 'text';
                } else {
                    signUpByEmailPassInput.current.type = 'password';
                }
            }
        },
        []
    );

    return (
        <div className="authentication__wrapper">
            <AuthLogin
                isOpen={login || false}
                handleLogin={handleLogin}
                handleMailChange={handleMailChange}
                handlePassChange={handlePassChange}
                handleHidePass={handleHidePass}
                inputMail={inputMail}
                inputPass={inputPass}
                loginByEmailPassInput={loginByEmailPassInput}
                authWithGoogle={authWithGoogle}
                textActions={textActions}
                isLoading={isLoading}
            />
            <AuthRegister
                isOpen={register || false}
                handleCreateUser={handleCreateUser}
                handleMailChange={handleMailChange}
                handlePassChange={handlePassChange}
                handleHidePass={handleHidePass}
                inputMail={inputMail}
                inputPass={inputPass}
                signUpByEmailPassInput={signUpByEmailPassInput}
                authWithGoogle={authWithGoogle}
                textActions={textActions}
                isLoading={isLoading}
            />
            <ForgotPassword
                isOpen={forgotPassword || false}
                handleResetPassword={handleResetPassword}
                handleMailChange={handleMailChange}
                inputMail={inputMail}
                textActions={textActions}
                isLoading={isLoading}
            />
            {authResponse && (
                <AuthResponse
                    setTextActions={setTextActions}
                    setIsStateTextActionChange={setIsStateTextActionChange}
                />
            )}
        </div>
    );
};

export default Authentication;
