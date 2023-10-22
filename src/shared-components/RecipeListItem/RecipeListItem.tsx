import { useState, useEffect } from 'react';
import { Recipe } from "../../types/type";
import nextId from "react-id-generator";
import { useAppSelector } from "../../hooks/hooks";
import './RecipeListItem.scss';

type HandleAddToFavorite = (recepieId: string|number|null, item: Recipe) => void;

const RecipeListItem = ({recipe, addToFavorite}: {recipe: Recipe, addToFavorite: HandleAddToFavorite}) => {
    const {ingredients, id, title, time, img, previewImg, favorites, category} = recipe;
    const timerClass = time ? "recipe-card__timer active" : "recipe-card__timer";
    const { uid } = useAppSelector(state => state.authentication.user);

    const renderedTags = ingredients?.map(item => {
        return (
            <li key={nextId("tag-id-")} className="product-tags__item">{item.tagText}</li>
        )
    });

    return (
        <div className="recipe-card">
            <a className="recipe-card__link" href={`/about-recepie/${id}`}>
                <div className="recipe-card__img-wrapper">
                    <img 
                        className="recipe-card__image"
                        width={290}
                        height={290}
                        src={previewImg} 
                        alt={title} />
                </div>
                <div className="recipe-card__content-text">
                    <h2 className="recipe-card__title" title={title}>{title.length > 42 ? (title.substring(0, 42) + '...') : title}</h2>
                    <div className="recipe-card__inner-wrapper">
                        {time.hours === '' && time.minutes === '' ? '' : <span className={timerClass}>{`${time.hours} ${time.minutes}`}</span>}
                        <ul className="recipe-card__product-tags product-tags">
                            {renderedTags ? renderedTags : null}
                        </ul>
                    </div>
                </div>
                <div className="recipe-card__current-category">{category}</div>
            </a>
            { uid ? <button 
                className = {favorites ? "recipe-card__favorite-btn active" : "recipe-card__favorite-btn"}
                onClick={() => {
                    addToFavorite(id, recipe);
                }}>
            </button> : undefined }
        </div>
    )
}

export default RecipeListItem;
