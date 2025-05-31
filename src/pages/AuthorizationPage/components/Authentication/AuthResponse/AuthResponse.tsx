import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import NewPassword from "./NewPassword/NewPassword";
import EmailVerification from "./EmailVerification/EmailVerification";
import type { TextActions } from "../Authentication";

const AuthResponse = ({
  setTextActions,
  setIsStateTextActionChange,
}: {
  setTextActions: Dispatch<SetStateAction<TextActions>>;
  setIsStateTextActionChange: Dispatch<SetStateAction<boolean>>;
}) => {
  const [searchParams] = useSearchParams();
  const [currentMode] = useState<null | string>(searchParams.get("mode"));
  const actionCode = searchParams.get("oobCode");
  const apiKey = searchParams.get("apiKey");
  const navigate = useNavigate();
  const { key } = useLocation();
  const isFirstPage = key === "default";

  useEffect(() => {
    let timeout: any;
    if (!actionCode || !apiKey || !currentMode) {
      timeout = setTimeout(() => {
        if (isFirstPage) {
          navigate("/");
        } else {
          navigate(-1);
        }
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section>
      {currentMode && currentMode === "resetPassword" && (
        <NewPassword setTextActions={setTextActions} setIsStateTextActionChange={setIsStateTextActionChange} />
      )}
      {currentMode && currentMode === "verifyEmail" && (
        <EmailVerification setTextActions={setTextActions} setIsStateTextActionChange={setIsStateTextActionChange} />
      )}
    </section>
  );
};

export default AuthResponse;
