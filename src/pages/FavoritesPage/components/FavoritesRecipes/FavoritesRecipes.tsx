import {FC} from 'react';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { fetchFavoritesRecipe } from "../../../../store/reducers/FavoritesRecipesSlice";

import RecipeList from "../../../../shared-components/RecipeList/RecipeLIst";

import ErrorMesage from "../../../../shared-components/ErrorMesage/ErrorMesage";

const FavoritesRecipes: FC = () => {
    const { favoriteRecipes, loadingRecipesById, error} = useAppSelector(state => state.favoriteRecipes);
    const {uid} = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (uid) {
            dispatch(fetchFavoritesRecipe(uid));
        }
    }, [uid]);

    const registerAttention = () => {
        return <div>Зареєструйтесь, щоб побачити список рецептів</div>
    }

    const content = () => {
        if (!uid) {
            return registerAttention();
        } else if (loadingRecipesById === 'failed' ) {
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
