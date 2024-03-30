import React from 'react';
import { LazyMotion, m } from 'framer-motion';
import nextId from 'react-id-generator';
import parse from 'html-react-parser';
import LazyLoad from 'react-lazy-load';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../hooks/hooks';
import { Recipe } from '../../../../types/type';
import iconsSprite from '../../../../assets/icons/about-recipe/sprite.svg';
import timerIcon from '../../../../assets/icons/timer-line2.svg';

type Props = {
    recipe: Recipe;
    handleEditRecipe: (recipe: Recipe) => void;
    handleAddFavorite: (
        id: string | number | null,
        recipe: Recipe,
        isFavorite: boolean
    ) => void;
};

const RecipeContent = (props: Props) => {
    const { recipe, handleEditRecipe, handleAddFavorite } = props;
    const {
        title,
        ingredients,
        imgDto,
        description,
        category,
        id,
        time,
        authorId,
    } = recipe;
    const favoriteRecipe = useAppSelector(
        (state) => state.favoriteRecipes.favoriteRecipes
    );
    const { uid, isAdmin } = useAppSelector(
        (state) => state.authentication.user
    );
    const isFavorite = favoriteRecipe.some((recipe) => recipe.id === id);
    const mainImg = imgDto.find((img) => img.id === 'main');
    const parsedDescr = parse(description || '');
    const navigate = useNavigate();
    return (
        <m.div
            key={`recipe-page-content-${id}`}
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
                transition: {
                    duration: 0.5,
                    delay: 0.1,
                },
            }}
        >
            <div className="recipe-page__top">
                <div className="recipe-page__top-btns">
                    {!authorId || uid === authorId || isAdmin ? (
                        <button
                            className="recipe-page__edit-btn"
                            title="редагувати"
                            type="button"
                            onClick={() => handleEditRecipe(recipe)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <use href={`${iconsSprite}/#edit`} />
                            </svg>
                        </button>
                    ) : (
                        ''
                    )}
                    <button
                        className={`recipe-page__favorite-btn ${
                            isFavorite ? 'btn-active' : ''
                        }`}
                        title="в обране"
                        type="button"
                        onClick={() => {
                            if (uid) {
                                handleAddFavorite(id, recipe, isFavorite);
                            } else {
                                navigate('/favorites');
                            }
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 22 22">
                            <use href={`${iconsSprite}#heart`} />
                        </svg>
                    </button>
                </div>
                <div className="recipe-page__top-wrapper">
                    <h2 className="recipe-page__title">{title}</h2>
                    <span className="recipe-page__categories">{category}</span>
                </div>
                <div className="recipe-page__photo-wrapper">
                    <LazyLoad>
                        <img
                            className="recipe-page__photo"
                            src={mainImg?.src || ''}
                            alt="фото"
                        />
                    </LazyLoad>
                </div>
            </div>
            <div className="recipe-page__content">
                <div className="recipe-page__left-col">
                    <div className="recipe-page__left-fixed">
                        <div className="recipe-page__cooking-time">
                            <h3 className="recipe-page__ingredients-title recipe-titles">
                                Час приготування
                            </h3>
                            <div className="recipe-page__time-inner">
                                <img
                                    className="recipe-page__time-icon"
                                    src={timerIcon}
                                    alt="час"
                                />
                                <span className="recipe-page__time-text">
                                    {time.hours ? `${time.hours} год` : ''}{' '}
                                    {time.minutes ? `${time.minutes} хв` : ''}
                                </span>
                            </div>
                        </div>
                        <div className="recipe-page__ingredients">
                            <h3 className="recipe-page__ingredients-title recipe-titles">
                                Інгредієнти
                            </h3>
                            <ul className="recipe-page__ingredients-list">
                                {ingredients?.map((ingredient) => {
                                    const {
                                        tagText,
                                        tagQuantityWithUnit,
                                        tagUnit,
                                    } = ingredient;
                                    return (
                                        <li
                                            key={nextId('ingredient-')}
                                            className="recipe-page__ingredients-item"
                                        >
                                            <span className="ingredients-item__character">
                                                {tagText}
                                            </span>
                                            {tagQuantityWithUnit && (
                                                <span className="ingredients-item__quantity">
                                                    {tagQuantityWithUnit}{' '}
                                                    {tagUnit}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="recipe-page__cooking-descr">
                    <h3 className="recipe-page__descr-title recipe-titles">
                        Процес приготування
                    </h3>
                    <div className="recipe-page__descr">{parsedDescr}</div>
                </div>
            </div>
        </m.div>
    );
};

export default RecipeContent;
