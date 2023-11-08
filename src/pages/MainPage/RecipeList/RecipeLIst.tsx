import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
    const nodeRef = useRef(null);
    const [animateOnLoading, setAnimateOnLoading] = useState(false);

    useEffect(() => {
        if (loading !== 'succeeded') {
            setAnimateOnLoading(false);
            return;
        }
        setTimeout(() => {
            setAnimateOnLoading(true);
        }, 200);
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
                <CSSTransition
                    key={`all-recipes-${item.id}`}
                    in={animateOnLoading}
                    nodeRef={nodeRef.current}
                    timeout={400}
                    className={`recipe-list__item ${
                        animateOnLoading ? '' : 'recipe-list__item_not-show'
                    }`}
                >
                    <li className="recipe-list__item" ref={nodeRef.current}>
                        <RecipeListItem
                            recipe={item}
                            addToFavorite={handleAddFavorite}
                        />
                    </li>
                </CSSTransition>
            );
        });
    };

    return (
        <ul className="recipe-list-main">
            <TransitionGroup className="recipe-list">
                {renderServerData({
                    loading,
                    error,
                    errorText: `${error}`,
                    content: renderItems,
                })}
            </TransitionGroup>
        </ul>
    );
};

export default RecipeList;
