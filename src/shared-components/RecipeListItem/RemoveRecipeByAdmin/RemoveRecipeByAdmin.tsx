import { useEffect, useState, useRef } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { deleteRecipe, localRemoveRecipe } from "../../../store/reducers/RecipesListSlice";
import { localRemoveFavoriteRecipe } from "../../../store/reducers/FavoritesRecipesSlice";
import loader from "../../../assets/icons/loader/loader.svg";

const RemoveRecipeByAdmin = ({ id }: { id: string | number | null }) => {
  const [isRemoveActive, setIsRemoveActive] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAppSelector((state) => state.authentication.user);
  const removeRecipeLoading = useAppSelector((state) => state.recipes.removeRecipeLoading);
  const dispatch = useAppDispatch();

  const variants = {
    open: {
      opacity: 1,
      scale: 1,
      display: "flex",
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
  };

  useEffect(() => {
    if (!notesRef.current) return undefined;
    const handleCloseNote = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${notesRef.current?.className.split(" ")[0]}` || "")) {
        setIsRemoveActive(false);
      }
    };
    if (isRemoveActive) {
      setTimeout(() => {
        window.addEventListener("click", handleCloseNote);
      }, 0);
    } else {
      window.removeEventListener("click", handleCloseNote);
    }
    return () => window.removeEventListener("click", handleCloseNote);
  }, [isRemoveActive]);

  const handledeleteRecipe = () => {
    if (!id) return;
    dispatch(deleteRecipe(id)).then(() => {
      dispatch(localRemoveRecipe(id));
      dispatch(localRemoveFavoriteRecipe(id));
    });
  };

  return (
    <>
      {isAdmin ? (
        <button
          className="recipe-card__remove-recipe"
          type="button"
          aria-label="видалити рецепт"
          title="видалити рецепт"
          onClick={() => setIsRemoveActive(true)}
        >
          {removeRecipeLoading !== "pending" ? (
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Icons/close">
                <path
                  id="Vector (Stroke)"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.79214 1.29214C1.01499 1.06929 1.37631 1.06929 1.59916 1.29214L9.20786 8.90084C9.43071 9.12369 9.43071 9.48501 9.20786 9.70786C8.98501 9.93071 8.62369 9.93071 8.40084 9.70786L0.79214 2.09916C0.569287 1.87631 0.569287 1.51499 0.79214 1.29214Z"
                  fill="#D24A34"
                />
                <path
                  id="Vector (Stroke)_2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.20786 1.29214C9.43071 1.51499 9.43071 1.87631 9.20786 2.09916L1.59916 9.70786C1.37631 9.93071 1.01499 9.93071 0.79214 9.70786C0.569287 9.48501 0.569287 9.12369 0.79214 8.90084L8.40084 1.29214C8.62369 1.06929 8.98501 1.06929 9.20786 1.29214Z"
                  fill="#D24A34"
                />
              </g>
            </svg>
          ) : (
            <img className="recipe-card__remove-loading" src={loader} alt="" />
          )}
        </button>
      ) : (
        ""
      )}
      <LazyMotion features={domAnimation} strict>
        <m.div
          animate={isRemoveActive ? "open" : "closed"}
          variants={variants}
          className="recipe-card__confirmation-remove-notes"
          ref={notesRef}
        >
          Ви впевнені, що хочете назавжди видалити цей рецепт?
          <div className="recipe-card__btns-wrapper">
            <button
              type="button"
              onClick={() => {
                handledeleteRecipe();
                setIsRemoveActive(false);
              }}
            >
              Видалити
            </button>
            <button type="button" onClick={() => setIsRemoveActive(false)}>
              Закрити
            </button>
          </div>
        </m.div>
      </LazyMotion>
    </>
  );
};

export default RemoveRecipeByAdmin;
