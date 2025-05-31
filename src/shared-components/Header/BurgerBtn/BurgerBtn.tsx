import { Dispatch, SetStateAction } from "react";
import "./BurgerBtn.scss";

const BurgerBtn = ({
  isBurgerOpen,
  setIsBurgerOpen,
}: {
  isBurgerOpen: boolean;
  setIsBurgerOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <button
      className={`burger-button ${isBurgerOpen ? "active" : ""}`}
      type="button"
      aria-label="мобільне меню"
      onClick={() => setIsBurgerOpen(!isBurgerOpen)}
    >
      <span className="burger-button__line" />
      <span className="burger-button__line" />
      <span className="burger-button__line" />
    </button>
  );
};

export default BurgerBtn;
