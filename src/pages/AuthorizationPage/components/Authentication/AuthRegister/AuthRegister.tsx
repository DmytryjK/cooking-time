import { NavLink } from 'react-router-dom';
import { useRef } from 'react';
import ActionsMessage from '../../ActionsMessage/ActionsMessage';
import type { TextActions } from '../Authentication';
import LoadingDataBtn from '../../../../../shared-components/LoadingDataBtn/LoadingDataBtn';
import './AuthRegister.scss';

type Props = {
    isOpen?: boolean;
    handleCreateUser: (e: React.FormEvent<HTMLFormElement>) => void;
    handleMailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePassChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleHidePass: (e: React.MouseEvent<HTMLButtonElement>) => void;
    inputMail: string;
    inputPass: string;
    signUpByEmailPassInput: React.RefObject<HTMLInputElement>;
    authWithGoogle: any;
    textActions: TextActions;
    isLoading: boolean;
};

const AuthRegister = (props: Props) => {
    const registerForm = useRef<HTMLFormElement>(null);
    const {
        isOpen,
        handleCreateUser,
        handleMailChange,
        handlePassChange,
        handleHidePass,
        inputMail,
        inputPass,
        signUpByEmailPassInput,
        authWithGoogle,
        textActions,
        isLoading,
    } = props;

    return (
        <div
            className={`authentication__block register ${
                isOpen ? 'active' : ''
            }`}
        >
            <h1 className="authentication__block-title">Зареєструватись</h1>
            <div className="authentication__block-list">
                <form
                    className="authorization__window-form form-email"
                    onSubmit={handleCreateUser}
                    ref={registerForm}
                >
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
                                    value={inputMail}
                                />
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
                                    ref={signUpByEmailPassInput}
                                />
                                <button
                                    className="input-password__hide-btn"
                                    title="hide-show password"
                                    type="button"
                                    aria-label="показати-приховати пароль"
                                    onClick={(e) => handleHidePass(e)}
                                />
                            </div>
                        </label>
                    </div>
                    {/* <div className="form-email__label-wrapper remeber-me__wrapper">
                        <label className="form-email__label remeber-me__label">
                            <input
                                className="form-email__checkbox"
                                type="checkbox"
                                name="stay loged in"
                            />
                            <span className="remeber-me__checkbox-default" />
                            <span className="remeber-me__checkbox-checked" />
                            <span>Запам'ятати мене</span>
                        </label>
                    </div> */}
                    {textActions.text[0] && (
                        <ActionsMessage textActions={textActions} />
                    )}
                    <LoadingDataBtn
                        isLoading={isLoading}
                        textBtn="Зареєструватись"
                        additionalClass="form-email__submit"
                        handleSubmit={() =>
                            registerForm.current?.requestSubmit()
                        }
                    />
                </form>
            </div>
            <div className="authentication__change-form">
                <span>Маєте аккаунт?</span>
                <NavLink
                    className="authentication__change-form_link"
                    to="/auth-login"
                >
                    Увійти
                </NavLink>
            </div>
            <div className="authentication__decorative-block">
                <span className="text">або</span>
            </div>
            <button
                className="authentication__block-btn"
                type="button"
                onClick={authWithGoogle}
            >
                <span className="authentication__block-text">
                    Продовжити через Google
                    <span className="authentication__block-decorative block-google" />
                </span>
            </button>
        </div>
    );
};

export default AuthRegister;
