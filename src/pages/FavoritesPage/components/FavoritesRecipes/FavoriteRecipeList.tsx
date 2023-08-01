import {FC} from 'react';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { setCurrentFilteredRecipes } from '../../../../store/reducers/RecipesListSlice';
import { fetchFavoritesRecipe, manageFavoritesRecipes } from '../../../../store/reducers/FavoritesRecipesSlice';
import ErrorMesage from "../../../../shared-components/ErrorMesage/ErrorMesage";
import renderServerData from '../../../../helpers/renderServerData';
import nextId from 'react-id-generator';
import RecipeListItem from '../../../../shared-components/RecipeListItem/RecipeListItem';

const FavoritesRecipes: FC = () => {
    const favoriteRecipes = useAppSelector(state => state.favoriteRecipes.favoriteRecipes);
    const loading = useAppSelector(state => state.favoriteRecipes.loadingRecipesById);
    const error = useAppSelector(state => state.favoriteRecipes.error);
    const filteredRecipes = useAppSelector(state => state.recipes.filteredRecipes);
    const {uid} = useAppSelector(state => state.authentication.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (uid) {
            dispatch(fetchFavoritesRecipe(uid));
        }
    }, [uid]);

    useEffect(() => {
        if (loading !== 'succeeded') return;
        dispatch(setCurrentFilteredRecipes(favoriteRecipes));
    }, [loading, favoriteRecipes]);

    const registerAttention = () => {
        return <div>Зареєструйтесь, щоб побачити список рецептів</div>
    }

    const handleAddFavorite = (recepieId: string | number | null) => {
        dispatch(manageFavoritesRecipes({recepieId, uid}));
    };

    const renderItems = () => {
        if (!uid) return registerAttention();
        if (loading === 'succeeded' && favoriteRecipes.length === 0) {
            return <ErrorMesage text={'Ваш список избранного пуст'}/>;
        } else {
            return filteredRecipes.map((item) => {
                return(
                    <li key={nextId("recipe-card-")} className="recipe-list__item">
                        <RecipeListItem recipe={item} addToFavorite={handleAddFavorite}/>
                    </li>
                )
            })
        }
    }
    
    return (
        <ul className='recipe-list'>
            {renderServerData({
                loading,
                error,
                errorText: 'Щось пішло не так, спробуйте ще раз',
                content: renderItems,
            })}
        </ul>
    )
}

export default FavoritesRecipes;
