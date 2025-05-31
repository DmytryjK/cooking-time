import { useCallback, useState, useRef, FormEvent, Dispatch, SetStateAction } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import type { Auth } from "firebase/auth";
import ActionsMessage from "../../../ActionsMessage/ActionsMessage";
import LoadingDataBtn from "../../../../../../shared-components/LoadingDataBtn/LoadingDataBtn";
import type { TextActions } from "../../Authentication";

const NewPassword = ({
  setTextActions,
  setIsStateTextActionChange,
}: {
  setTextActions: Dispatch<SetStateAction<TextActions>>;
  setIsStateTextActionChange: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [textActionsRes, setTextActionsRes] = useState<TextActions>({
    text: [""],
    status: "",
  });
  const passRef = useRef<HTMLInputElement>(null);
  const forgotPassForm = useRef<HTMLFormElement>(null);

  const [passInput, setPassInput] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const actionCode = searchParams.get("oobCode") || "";
  const handleHidePass = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (passRef.current) {
      if (passRef.current.type === "password") {
        passRef.current.type = "text";
      } else {
        passRef.current.type = "password";
      }
    }
  }, []);

  const handleResetPassword = useCallback(
    (auth: Auth, actionCode: string, e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
          confirmPasswordReset(auth, actionCode, passInput)
            .then((resp) => {
              setTextActionsRes({
                text: [`Пароль успішно змінено`],
                status: "SUCCESS",
              });
              setTimeout(() => {
                setIsStateTextActionChange(false);
                setTextActions({
                  text: [`Увійдіть, використовуючи нові дані`],
                  status: "SUCCESS",
                });
                navigate("/auth-login");
              }, 1000);
            })
            .catch((error) => {
              if (error.code === "auth/weak-password") {
                setTextActionsRes({
                  text: [`Пароль закороткий, введіть мінімум 6 символів`],
                  status: "WARNING",
                });
              }
            })
            .finally(() => {
              setIsLoading(false);
            });
        })
        .catch((error) => {
          if (error.code === "auth/invalid-action-code") {
            setTextActionsRes({
              text: [
                `Некоректний код верифікації, спробуйте перейти за посиланням ще раз, або запросіть повторну зміну паролю `,
              ],
              status: "WARNING",
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [passInput],
  );
  return (
    <div className="authentication__block response active">
      <h1 className="authentication__block-title">Відновлення паролю</h1>
      <div className="authentication__block-list">
        <form
          className="authorization__window-form form-email"
          ref={forgotPassForm}
          onSubmit={(e) => handleResetPassword(auth, actionCode, e)}
        >
          <div className="form-email__label-wrapper">
            <label className="form-email__label">
              <span>Введіть ваш новий пароль</span>
              <div className="form-email__input-wrapper input-password__wrapper">
                <input
                  className="form-email__input input-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="&#10625; &#10625; &#10625; &#10625; &#10625; &#10625; &#10625;"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  ref={passRef}
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
          {textActionsRes.text[0] && <ActionsMessage textActions={textActionsRes} />}
          <LoadingDataBtn
            textBtn="Зберегти пароль"
            isLoading={isLoading}
            additionalClass="form-email__submit"
            handleSubmit={() => forgotPassForm.current?.requestSubmit()}
          />
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
