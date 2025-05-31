import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import RecipeListItem from "../../../shared-components/RecipeListItem/RecipeListItem";
import { setFavoriteRecipes, setCurrentFilteredRecipes } from "../../../store/reducers/RecipesListSlice";
import { manageFavoritesRecipes } from "../../../store/reducers/FavoritesRecipesSlice";
import renderServerData from "../../../helpers/renderServerData";
import type { Recipe } from "../../../types/type";
import "./RecipeLIst.scss";

const RecipeList = () => {
  const filteredRecipes = useAppSelector((state) => state.recipes.filteredRecipes);
  const { uid } = useAppSelector((state) => state.authentication.user);
  const recipes = useAppSelector((state) => state.recipes.recipes);
  const loading = useAppSelector((state) => state.recipes.loadingRecipes);
  const error = useAppSelector((state) => state.recipes.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loading === "succeeded") {
      dispatch(setCurrentFilteredRecipes(recipes));
    }
  }, [loading, JSON.stringify(recipes)]);

  const handleAddFavorite = (recepieId: string | number | null, item: Recipe) => {
    dispatch(manageFavoritesRecipes({ item, uid }));
    dispatch(
      setFavoriteRecipes({
        recipeId: recepieId,
        isFavorite: !item.favorites,
      }),
    );
  };

  const renderItems = () => {
    return filteredRecipes.map((item, index) => {
      return (
        <li className="recipe-list__item" key={`all-recipes-${item.id}`}>
          <RecipeListItem recipe={item} addToFavorite={handleAddFavorite} index={index} />
        </li>
      );
    });
  };

  return (
    <div className="recipe-list-main">
      <ul className=" recipe-list">
        <AnimatePresence>{filteredRecipes.length > 0 && renderItems()}</AnimatePresence>
        {renderServerData({
          loading,
          error,
          errorText: `${error}`,
          content: () => "",
        })}
      </ul>
    </div>
  );
};

export default RecipeList;
