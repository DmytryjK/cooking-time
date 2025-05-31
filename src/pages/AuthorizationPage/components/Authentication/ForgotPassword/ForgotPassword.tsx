import { useRef } from "react";
import { NavLink } from "react-router-dom";
import ActionsMessage from "../../ActionsMessage/ActionsMessage";
import LoadingDataBtn from "../../../../../shared-components/LoadingDataBtn/LoadingDataBtn";
import type { TextActions } from "../Authentication";

type Props = {
  isOpen?: boolean;
  inputMail: string;
  handleResetPassword: (e: React.MouseEvent<HTMLFormElement>) => void;
  handleMailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  textActions: TextActions;
  isLoading: boolean;
};

const ForgotPassword = (props: Props) => {
  const resetFormRef = useRef<HTMLFormElement>(null);
  const { isOpen, handleResetPassword, handleMailChange, inputMail, textActions, isLoading } = props;

  return (
    <div className={`authentication__block login ${isOpen ? "active" : ""}`}>
      <h1 className="authentication__block-title">Відновлення паролю</h1>
      <div className="authentication__block-list">
        <form className="authorization__window-form form-email" onSubmit={handleResetPassword} ref={resetFormRef}>
          <div className="form-email__label-wrapper">
            <label className="form-email__label">
              <span>Введіть адресу електронної пошти від якої забули пароль</span>
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
          {textActions.text[0] && <ActionsMessage textActions={textActions} />}
          <LoadingDataBtn
            textBtn="Відновити пароль"
            isLoading={isLoading}
            additionalClass="form-email__submit_forgot"
            handleSubmit={() => resetFormRef.current?.requestSubmit()}
          />
        </form>
      </div>
      <div className="authentication__change-form">
        <NavLink className="authentication__change-form_link" to="/auth-login">
          Назад
        </NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;
