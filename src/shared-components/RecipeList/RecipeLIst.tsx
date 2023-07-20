import { useEffect, FC, useState, memo } from 'react';
import './RecipeLIst.scss';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';

// import { setFavoriteRecipes, setCurrentRecipes } from './RecepieListSlice';
import { setFavoriteRecipes } from '../../store/reducers/RecepieListSlice';
import { cloneRecepies } from '../../store/reducers/FiltersSlice';
import { manageFavoritesRecipes, setCurrentFavoriteId } from '../../store/reducers/FavoritesRecipesSlice';

import RecipeListItem from '../RecipeListItem/RecipeListItem';

import type { Recepie } from '../../types/type';
import nextId from "react-id-generator";
import { useLocation } from 'react-router-dom';

interface RecipeListProps {
    fetchedRecipes: Recepie[];
    loadStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const RecipeList: FC<RecipeListProps> = ({fetchedRecipes, loadStatus}) => {

    const { error } = useAppSelector(state => state.recepies);
    const { loadingRecipeIdToFirebase, currentFavoriteId } = useAppSelector(state => state.favoriteRecipes);
    const { filteredRecepies } = useAppSelector(state => state.filters);
    const { uid } = useAppSelector(state => state.authentication.user);

    const dispatch = useAppDispatch();
    const currentLink = useLocation().pathname;

    console.log('rerender-list');

    // useEffect(() => {
    //     if (loadStatus === 'succeeded') {
    //         dispatch(setCurrentRecipes(fetchedRecipes));
    //     }
    // }, [loadStatus]);

    // useEffect(() => {
    //     dispatch(cloneRecepies(recepies));
    // }, [recepies]); 

    // useEffect(() => {
    //     if (currentLink === '/favorites' && loadingRecipeIdToFirebase === 'succeeded') {
    //         const removedItem = filteredRecepies.filter(item => item.id !== currentFavoriteId);
    //         // dispatch(setCurrentRecipes(removedItem));
    //     }
    // }, [loadingRecipeIdToFirebase]);

    const handleAddFavorite = (recepieId: string | number | null, item: Recepie, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('test')
        dispatch(manageFavoritesRecipes({recepieId, uid}));
        // dispatch(setFavoriteRecipes({recipeId: recepieId, isFavorite: !item.favorites}));
        // dispatch(setCurrentFavoriteId(recepieId));
    };

    const renderItems = (items: Recepie[]) => {
        if (items) {
            const renderedList = items.map((item) => {
                return(
                    <li key={nextId("recipe-card-")} className="recipe-list__item">
                        <RecipeListItem recipe={item} addToFavorite={handleAddFavorite}/>
                    </li>
                )
            })
            return renderedList;
        }
    }

    // const renderedContent = () => {
    //     let renderedComponents = null;
    //     if (loadStatus !== 'succeeded') {
    //         renderedComponents = 'loading...';
    //     } else if (error) {
    //         renderedComponents = "Something wen't wrong, try again";
    //     } else if (loadStatus === 'succeeded') {
    //         renderedComponents = renderItems(fetchedRecipes);
    //     } else if (filteredRecepies.length === 0 && loadStatus === 'succeeded') {
    //         renderedComponents = 'Поиск не дал результатов, попробуйте ещё раз';
    //     }

    //     // else if (loadStatus === 'succeeded' && filteredRecepies.length > 0) {
    //     //     renderedComponents = renderItems(filteredRecepies);
    //     // } else if (filteredRecepies.length === 0 && loadStatus === 'succeeded') {
    //     //     renderedComponents = 'Поиск не дал результатов, попробуйте ещё раз';
    //     // }
    //     return renderedComponents;
    // }
    
    return (
        <ul className='recipe-list'>
            {/* {renderedContent()} */}
            {renderItems(fetchedRecipes)}
        </ul>
    )
}

export default RecipeList;
