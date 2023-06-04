import {FC} from 'react';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchFavoritesId, fetchFavoritesRecipesById } from "./FavoritesRecipesSlice";

import RecipeLIst from "../RecipeList/RecipeLIst";

import ErrorMesage from "../ErrorMesage/ErrorMesage";

const FavoritesRecipes: FC = () => {
    const {favoriteRecipesId, favoriteRecipes, loadingRecipesById, loadingRecipeId, error} = useAppSelector(state => state.favoriteRecipes);
    const {uid} = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        uid && dispatch(fetchFavoritesId(uid));
    }, [uid]);

    useEffect(() => {
        if ( loadingRecipeId === 'succeeded' ) {
            dispatch(fetchFavoritesRecipesById(favoriteRecipesId));
        }
    }, [favoriteRecipesId]);


    const content = () => {
        if (loadingRecipeId === 'failed' || loadingRecipesById === 'failed' ) {
            return <ErrorMesage text={error}/>
        } else if (loadingRecipeId === 'succeeded' && loadingRecipesById === 'succeeded' && favoriteRecipesId.length === 0) {
            return <ErrorMesage text={'Ваш список избранного пуст'}/>
        } else {
            return <RecipeLIst fetchedRecipes={favoriteRecipes} loadStatus={loadingRecipesById}/>; 
        }
    }

    return (
        <>
            {content()}
        </>
    )
}

export default FavoritesRecipes;
