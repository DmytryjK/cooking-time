import { Recepie } from "../../types/type";
import nextId from "react-id-generator";
import { useAppSelector } from "../../hooks/hooks";

import favoriteBtn from '../../resources/icons/favorites/Heart.svg';

import './RecipeListItem.scss';

type HandleAddToFavorite = (recepieId: string|number|null, item: Recepie, e: React.MouseEvent<HTMLButtonElement>) => void;

const RecipeListItem = ({recipe, addToFavorite}: {recipe: Recepie, addToFavorite: HandleAddToFavorite}) => {
    const {ingredients, id, title, time, img, favorites} = recipe;
    const timerClass = time ? "recipe-card__timer active" : "recipe-card__timer";
    const { uid } = useAppSelector(state => state.authentication.user);

    const renderedTags = ingredients?.map(item => {
        return (
            <li key={nextId("tag-id-")} className="product-tags__item">{item}</li>
        )
    });

    return (
        <a className="recipe-card" href={`/about-recepie/${id}`}>
            <div className="recipe-card__img-wrapper">
                <img 
                    className="recipe-card__image"
                    src={img} 
                    alt={title} />
            </div>
            <div className="recipe-card__content-wrapper">
                <div className="recipe-card__content-text">
                    <h2 className="recipe-card__title" title={title}>{title.length > 42 ? (title.substring(0, 42) + '...') : title}</h2>
                    <span className={timerClass}>{time ? time + 'min' : null}</span>
                    <ul className="recipe-card__product-tags product-tags">
                        {renderedTags ? renderedTags : null}
                    </ul>
                </div>
            </div>
            { uid ? <button 
                className = {favorites ? "recipe-card__favorite-btn active" : "recipe-card__favorite-btn"}
                onClick={(e) => addToFavorite(id, recipe, e)}>
                    {/* <img className="recipe-card__favorite-icon" src={favoriteBtn} alt="" /> */}
            </button> : undefined }
            <div className="recipe-card__current-category">Перші страви</div>
        </a>
    )
}

export default RecipeListItem;