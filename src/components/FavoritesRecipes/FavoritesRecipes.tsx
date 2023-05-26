import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchFavoritesId, fetchFavoritesRecipesById } from "./FavoritesRecipesSlice";

import RecipeLIst from "../RecipeList/RecipeLIst";

import ErrorMesage from "../ErrorMesage/ErrorMesage";

const FavoritesRecipes = () => {
    const {favoriteRecipesId, favoriteRecipes, loadingRecipesById, loadingRecipeId, error} = useAppSelector(state => state.favoriteRecipes);
    const {uid} = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        uid && dispatch(fetchFavoritesId(uid));
    }, [uid]);


    useEffect(() => {
        if ( loadingRecipesById === 'succeeded' ) {
            dispatch(fetchFavoritesRecipesById(favoriteRecipesId));
        }
    }, [favoriteRecipesId]);
 
    const loading = loadingRecipesById !== 'succeeded' ? 'loading' : undefined;
    const content = favoriteRecipesId.length === 0 && loadingRecipesById === 'idle' ? 'Список избранного пуст, добавьте рецепты на главной странице' : <RecipeLIst fetchedRecipes={favoriteRecipes} loadStatus={loadingRecipesById}/>; 

    return (
        <>
            <ErrorMesage text={error instanceof Error ? error["message"] : ''}/>
            {/* {loading} */}
            {/* {content} */}
        </>
        
        // <RecipeLIst fetchedRecipes={favoriteRecipes} loadStatus={loadingRecipesById}/>
        // favoriteRecipesId.length > 0 ? <RecipeLIst fetchedRecipes={favoriteRecipes} loadStatus={loadingRecipesById}/> : <p>Список избранного пуст, вы можете добавить рецепты на Главной странице</p>
    )
}

export default FavoritesRecipes;
