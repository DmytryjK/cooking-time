import { FC, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

import { createUser } from '../../../../store/reducers/AuthenticationSlice';
import { useAppDispatch } from '../../../../hooks/hooks';
import AuthLogin from './AuthLogin/AuthLogin';
import AuthRegister from './AuthRegister/AuthRegister';
import './Authentication.scss';

type AuthorizationPageProps = {
    register?: boolean;
    login?: boolean;
};

const Authentication: FC<AuthorizationPageProps> = ({ register, login }) => {
    const navigate = useNavigate();

    const [inputMail, setInputMail] = useState<string>('sdfasdfgs');
    const [inputPass, setInputPass] = useState<string>('');
    const loginByEmailPassInput = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        if (localStorage.getItem('user')) navigate('/');
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.uid && user.email) {
                    const userToSave = { uid: user.uid, email: user.email };
                    localStorage.setItem('user', JSON.stringify(userToSave));
                    dispatch(createUser(userToSave));
                }
            } else {
                localStorage.clear();
                console.log('try to login');
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
            .then(({ user }) => {
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, inputMail, inputPass)
            .then(({ user }) => {
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const authWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const { user } = result;
                navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const { email } = error.customData;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
            });
    };

    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMail(e.currentTarget.value);
    };

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPass(e.currentTarget.value);
    };

    const handleHidePass = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (loginByEmailPassInput.current) {
            if (loginByEmailPassInput.current.type === 'password') {
                loginByEmailPassInput.current.type = 'text';
            } else {
                loginByEmailPassInput.current.type = 'password';
            }
        }
    };

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
            />
            <AuthRegister
                isOpen={register || false}
                handleCreateUser={handleCreateUser}
                handleMailChange={handleMailChange}
                handlePassChange={handlePassChange}
                handleHidePass={handleHidePass}
                inputMail={inputMail}
                inputPass={inputPass}
                loginByEmailPassInput={loginByEmailPassInput}
                authWithGoogle={authWithGoogle}
            />
        </div>
    );
};

export default Authentication;
