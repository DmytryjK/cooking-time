import {FC} from 'react';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchFavoritesRecipe } from "./FavoritesRecipesSlice";

import RecipeList from "../RecipeList/RecipeLIst";

import ErrorMesage from "../ErrorMesage/ErrorMesage";

const FavoritesRecipes: FC = () => {
    const { favoriteRecipes, loadingRecipesById, loadingRecipeIdToFirebase, error} = useAppSelector(state => state.favoriteRecipes);
    const {uid} = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (uid) {
            dispatch(fetchFavoritesRecipe(uid));
        }
    }, [uid, loadingRecipeIdToFirebase]);

    const content = () => {
        if (loadingRecipesById === 'failed' ) {
            return <ErrorMesage text={error}/>
        } else if (loadingRecipesById === 'succeeded' && favoriteRecipes.length === 0) {
            return <ErrorMesage text={'Ваш список избранного пуст'}/>
        } else {
            return <RecipeList fetchedRecipes={favoriteRecipes} loadStatus={loadingRecipesById}/>; 
        }
    }

    return (
        <>
            {content()}
        </>
    )
}

export default FavoritesRecipes;
