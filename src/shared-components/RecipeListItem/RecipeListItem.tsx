import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    isAnimate,
    setIsAnimate,
}: {
    recipe: Recipe;
    addToFavorite: HandleAddToFavorite;
    isAnimate?: { id: string | number | null; animate: boolean };
    setIsAnimate?: Dispatch<
        SetStateAction<{ id: string | number | null; animate: boolean }>
    >;
}) => {
    const { ingredients, id, title, time, imgDto, favorites, category } =
        recipe;

    const { pathname } = useLocation();

    const previewImg = imgDto.find((img) => img.id === 'previewImg');
    const timerClass = time
        ? 'recipe-card__timer active'
        : 'recipe-card__timer';
    const { uid } = useAppSelector((state) => state.authentication.user);
    const navigate = useNavigate();
    const noderef = useRef(null);

    const renderedTags = ingredients?.map((item) => {
        return (
            <li key={`item-tagtext-${item.id}`} className="product-tags__item">
                {item.tagText}
            </li>
        );
    });

    return (
        <CSSTransition
            in={isAnimate && isAnimate.animate && isAnimate.id === id}
            onEnter={() => setTimeout(() => addToFavorite(id, recipe), 200)}
            nodeRef={noderef}
            timeout={300}
            className="recipe-card"
        >
            <div className="recipe-card" ref={noderef}>
                <NavLink
                    className="recipe-card__link"
                    to={`/about-recepie/${id}`}
                >
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
                    <div className="recipe-card__current-category">
                        {category}
                    </div>
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
                            if (setIsAnimate) {
                                setIsAnimate({
                                    id,
                                    animate: true,
                                });
                            } else {
                                addToFavorite(id, recipe);
                            }
                        } else {
                            navigate('/favorites');
                        }
                    }}
                />
            </div>
        </CSSTransition>
    );
};

export default RecipeListItem;
