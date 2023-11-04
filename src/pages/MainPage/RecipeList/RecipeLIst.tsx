import { useEffect } from 'react';
import nextId from 'react-id-generator';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks';
import RecipeListItem from '../../../shared-components/RecipeListItem/RecipeListItem';
import {
    setFavoriteRecipes,
    setCurrentFilteredRecipes,
} from '../../../store/reducers/RecipesListSlice';
import { manageFavoritesRecipes } from '../../../store/reducers/FavoritesRecipesSlice';
import renderServerData from '../../../helpers/renderServerData';
import type { Recipe } from '../../../types/type';
import './RecipeLIst.scss';

const RecipeList = () => {
    const filteredRecipes = useAppSelector(
        (state) => state.recipes.filteredRecipes
    );
    const { uid } = useAppSelector((state) => state.authentication.user);
    const recipes = useAppSelector((state) => state.recipes.recipes);
    const loading = useAppSelector((state) => state.recipes.loadingRecipes);
    const error = useAppSelector((state) => state.recipes.error);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (loading !== 'succeeded') return;
        dispatch(setCurrentFilteredRecipes(recipes));
    }, [loading]);

    const handleAddFavorite = (
        recepieId: string | number | null,
        item: Recipe
    ) => {
        dispatch(manageFavoritesRecipes({ recepieId, uid }));
        dispatch(
            setFavoriteRecipes({
                recipeId: recepieId,
                isFavorite: !item.favorites,
            })
        );
    };

    const renderItems = () => {
        return filteredRecipes.map((item) => {
            return (
                <li key={nextId('recipe-card-')} className="recipe-list__item">
                    <RecipeListItem
                        recipe={item}
                        addToFavorite={handleAddFavorite}
                    />
                </li>
            );
        });
    };

    return (
        <ul className="recipe-list">
            {renderServerData({
                loading,
                error,
                errorText: `${error}`,
                content: renderItems,
            })}
        </ul>
    );
};

export default RecipeList;
