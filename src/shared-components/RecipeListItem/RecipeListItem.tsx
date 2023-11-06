import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import nextId from 'react-id-generator';
import { Recipe } from '../../types/type';
import { useAppSelector } from '../../hooks/hooks';
import './RecipeListItem.scss';

type HandleAddToFavorite = (
    recepieId: string | number | null,
    item: Recipe
) => void;

const RecipeListItem = ({
    recipe,
    addToFavorite,
}: {
    recipe: Recipe;
    addToFavorite: HandleAddToFavorite;
}) => {
    const { ingredients, id, title, time, imgDto, favorites, category } =
        recipe;

    const previewImg = imgDto.find((img) => img.id === 'previewImg');
    const timerClass = time
        ? 'recipe-card__timer active'
        : 'recipe-card__timer';
    const { uid } = useAppSelector((state) => state.authentication.user);
    const navigate = useNavigate();

    const renderedTags = ingredients?.map((item) => {
        return (
            <li key={nextId('tag-id-')} className="product-tags__item">
                {item.tagText}
            </li>
        );
    });

    return (
        <div className="recipe-card">
            <NavLink className="recipe-card__link" to={`/about-recepie/${id}`}>
                <div className="recipe-card__img-wrapper">
                    <img
                        className="recipe-card__image"
                        width={290}
                        height={290}
                        src={previewImg?.src || ''}
                        alt={title}
                    />
                </div>
                <div className="recipe-card__content-text">
                    <h2 className="recipe-card__title" title={title}>
                        {title.length > 42
                            ? `${title.substring(0, 42)}...`
                            : title}
                    </h2>
                    <div className="recipe-card__inner-wrapper">
                        {time.hours === '' && time.minutes === '' ? (
                            ''
                        ) : (
                            <span className={timerClass}>
                                {time.hours ? `${time.hours} год.` : ''}{' '}
                                {time.minutes ? `${time.minutes} хв.` : ''}
                            </span>
                        )}
                        <ul className="recipe-card__product-tags product-tags">
                            {renderedTags || null}
                        </ul>
                    </div>
                </div>
                <div className="recipe-card__current-category">{category}</div>
            </NavLink>
            <button
                className={
                    favorites
                        ? 'recipe-card__favorite-btn active'
                        : 'recipe-card__favorite-btn'
                }
                type="button"
                aria-label="додати в обране"
                onClick={() => {
                    if (uid) {
                        addToFavorite(id, recipe);
                    } else {
                        navigate('/favorites');
                    }
                }}
            />
        </div>
    );
};

export default RecipeListItem;
