import { FC, memo, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { setFavoriteRecipes } from '../../../../store/reducers/RecipesListSlice';
import {
    setCurrentFilteredFavoriteRecipes,
    fetchFavoritesRecipes,
    manageFavoritesRecipes,
} from '../../../../store/reducers/FavoritesRecipesSlice';
import EmptyFavoriteList from '../EmptyFavoriteList/EmptyFavoriteList';
import UnauthorizedFavoriteList from '../UnauthorizedFavoriteList/UnauthorizedFavoriteList';
import renderServerData from '../../../../helpers/renderServerData';
import RecipeListItem from '../../../../shared-components/RecipeListItem/RecipeListItem';
import type { Recipe } from '../../../../types/type';
import './FavoriteRecipeList.scss';

const FavoriteRecipeList: FC = () => {
    const favoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.favoriteRecipes
    );
    const loadingFavorites = useAppSelector(
        (state) => state.favoriteRecipes.loadingRecipesById
    );
    const loadingRecipeIdToFirebase = useAppSelector(
        (state) => state.favoriteRecipes.loadingRecipeIdToFirebase
    );
    const filteredFavoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.filteredFavoriteRecipes
    );
    const error = useAppSelector((state) => state.favoriteRecipes.error);
    const { uid } = useAppSelector((state) => state.authentication.user);
    const [animateOnLoading, setAnimateOnLoading] = useState(false);
    const [isCardAnimateEnd, setIsCardAnimateEnd] = useState(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (uid && loadingFavorites === 'idle') {
            dispatch(fetchFavoritesRecipes(uid)).then((result) => {
                dispatch(
                    setCurrentFilteredFavoriteRecipes(
                        result.payload as Recipe[]
                    )
                );
            });
        }
    }, [uid, favoriteRecipes, loadingFavorites]);

    useEffect(() => {
        if (uid) {
            dispatch(setCurrentFilteredFavoriteRecipes(favoriteRecipes));
        }
    }, [uid, favoriteRecipes, loadingFavorites, loadingRecipeIdToFirebase]);

    const registerAttention = () => {
        return <UnauthorizedFavoriteList />;
    };

    const handleAddFavorite = (
        recepieId: string | number | null,
        item: Recipe
    ) => {
        setAnimateOnLoading(false);
        dispatch(manageFavoritesRecipes({ item, uid })).then(() => {
            dispatch(
                setFavoriteRecipes({
                    recipeId: recepieId,
                    isFavorite: !item.favorites,
                })
            );
        });
    };
    const renderItems = () => {
        return filteredFavoriteRecipes.map((item, index) => {
            return (
                <li
                    className="recipe-list__item"
                    key={`favorite-recipes-${item.id}`}
                >
                    <RecipeListItem
                        recipe={item}
                        addToFavorite={handleAddFavorite}
                        index={index}
                        setIsCardAnimateEnd={setIsCardAnimateEnd}
                    />
                </li>
            );
        });
    };

    return (
        <div className="recipe-list-favorites">
            <ul className="recipe-list">
                <AnimatePresence
                    onExitComplete={() => setIsCardAnimateEnd(true)}
                >
                    {uid && loadingFavorites === 'succeeded' && renderItems()}
                    {uid &&
                        loadingFavorites === 'succeeded' &&
                        favoriteRecipes.length === 0 &&
                        isCardAnimateEnd && (
                            <EmptyFavoriteList key="empty-favorite-item" />
                        )}
                </AnimatePresence>
                {uid
                    ? renderServerData({
                          loading: loadingFavorites,
                          error,
                          errorText: 'Щось пішло не так, спробуйте ще раз',
                          content: () => '',
                      })
                    : registerAttention()}
            </ul>
        </div>
    );
};

export default memo(FavoriteRecipeList);
