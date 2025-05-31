import { LazyMotion, AnimatePresence, domAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipe, setFavoriteRecipes } from "../../store/reducers/RecipesListSlice";
import { manageFavoritesRecipes, fetchFavoritesRecipes } from "../../store/reducers/FavoritesRecipesSlice";
import PopUp from "../../shared-components/PopUp/PopUp";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import EditRecipeForm from "./components/EditRecipeForm/EditRecipeForm";
import { Recipe } from "../../types/type";
import RecentlyViewed from "./components/RecentlyViewed/RecentlyViewed";
import RecipeContent from "./components/RecipeContent/RecipeContent";
import "./AboutRecipePage.scss";
import Loader from "../../shared-components/Loader/Loader";

const AboutRecipePage = () => {
  const recipeId = useParams();
  const { recipe, loadingRecipe, error } = useAppSelector((state) => state.recipes);
  const loadingRecipesToFirebase = useAppSelector((state) => state.favoriteRecipes.loadingRecipeIdToFirebase);
  const { uid } = useAppSelector((state) => state.authentication.user);
  const dispatch = useAppDispatch();
  const [isEditActive, setIsEditActive] = useState<boolean>(false);
  const [currentRecipeToEdit, setCurrentRecipeToEdit] = useState<Recipe | null>(null);
  const [attentionWindowOpen, setAttentionWindowOpen] = useState<boolean>(false);

  useEffect(() => {
    if (loadingRecipe === "succeeded") {
      window.scrollTo({ top: 0 });
    }
  }, [loadingRecipe]);

  useEffect(() => {
    if (!recipeId.id) return;
    dispatch(fetchRecipe(recipeId.id));
    if (!uid) return;
    dispatch(fetchFavoritesRecipes(uid));
  }, [uid, recipeId]);

  useEffect(() => {
    if (loadingRecipesToFirebase !== "succeeded") return;
    dispatch(fetchFavoritesRecipes(uid));
  }, [loadingRecipesToFirebase]);

  const handleEditRecipe = useCallback(
    (fetchedRecepieInfo: Recipe) => {
      setIsEditActive(true);
      setCurrentRecipeToEdit(fetchedRecepieInfo);
    },
    [recipe?.id],
  );

  const handleAddFavorite = useCallback(
    (recipeId: string | number | null, item: Recipe, isFavorite: boolean) => {
      dispatch(manageFavoritesRecipes({ item, uid })).then(() => {
        dispatch(
          setFavoriteRecipes({
            recipeId,
            isFavorite: !isFavorite,
          }),
        );
      });
    },
    [recipe?.id],
  );

  const handleBtnPopUpAction = useCallback(() => {
    setAttentionWindowOpen(false);
    setIsEditActive(false);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="about-recipe">
        <div className="container">
          <PopUp
            isPopUpShow={attentionWindowOpen}
            setIsPopUpShow={setAttentionWindowOpen}
            text="Ви впевнені, що хочете повернутись назад?"
            subtext="Якщо Ви закриєте редактор, то зміни не буде збережено."
            additionalBtnText="Скасувати редагування"
            additionalBtnAction={handleBtnPopUpAction}
            setIsEditActive={setIsEditActive}
          />

          <main className="recipe-page">
            {isEditActive && currentRecipeToEdit && (
              <EditRecipeForm
                key="editRecipe"
                recipe={currentRecipeToEdit}
                setIsAttentionOpen={setAttentionWindowOpen}
                setIsEditActive={setIsEditActive}
              />
            )}
            <AnimatePresence>
              {recipe && loadingRecipe === "succeeded" && !isEditActive && (
                <RecipeContent
                  key={`content-${recipe.id}`}
                  recipe={recipe}
                  handleEditRecipe={handleEditRecipe}
                  handleAddFavorite={handleAddFavorite}
                />
              )}
            </AnimatePresence>
            {loadingRecipe === "pending" && <Loader />}
            {error ? "щось пішло не так(" : ""}
          </main>
          {recipe?.id && <RecentlyViewed key={`recently-viewed-bblock-${recipe.id}`} currentId={recipe.id} />}
        </div>
      </section>
    </LazyMotion>
  );
};

export default AboutRecipePage;
