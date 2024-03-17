import LazyLoad from 'react-lazy-load';
import { useRef, Dispatch, SetStateAction, memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { easeOut, LazyMotion, m, domMax } from 'framer-motion';
import RemoveRecipeByAdmin from './RemoveRecipeByAdmin/RemoveRecipeByAdmin';
import { Recipe } from '../../types/type';
import { useAppSelector } from '../../hooks/hooks';
import type { IngredientsType } from '../../types/type';
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
    index,
    setIsCardAnimateEnd,
}: {
    recipe: Recipe;
    addToFavorite: HandleAddToFavorite;
    isAnimate?: { id: string | number | null; animate: boolean };
    setIsAnimate?: Dispatch<
        SetStateAction<{ id: string | number | null; animate: boolean }>
    >;
    index: number;
    setIsCardAnimateEnd?: Dispatch<SetStateAction<boolean>>;
}) => {
    const { ingredients, id, title, time, imgDto, favorites, category } =
        recipe;

    const previewImg = imgDto.find((img) => img.id === 'previewImg');
    const timerClass = time
        ? 'recipe-card__timer active'
        : 'recipe-card__timer';
    const { uid, isAdmin } = useAppSelector(
        (state) => state.authentication.user
    );
    const searchedTagFilled = useAppSelector(
        (state) => state.recipes.searchedTagFilled
    );
    const navigate = useNavigate();
    const noderef = useRef(null);

    const renderedTags = () => {
        if (!ingredients) return '';
        let result: JSX.Element | JSX.Element[] = <span />;
        result = ingredients.map((item) => {
            return (
                <li
                    key={`item-tagtext-${item.id}`}
                    className="product-tags__item"
                >
                    {item.tagText}
                </li>
            );
        });
        if (searchedTagFilled.length > 0) {
            const indexesOfIngredients = ingredients
                .map((ingredient, index) => {
                    let result = null;
                    if (
                        searchedTagFilled.some((searchTag) => {
                            if (
                                ingredient.tagText
                                    .toLowerCase()
                                    .includes(
                                        searchTag.recipeIngredient.toLowerCase()
                                    )
                            ) {
                                return true;
                            }
                            return false;
                        })
                    ) {
                        result = index;
                    }
                    return result;
                })
                .filter((item) => item !== null);
            let copiedIngredients: IngredientsType[] = JSON.parse(
                JSON.stringify(ingredients)
            );
            indexesOfIngredients.forEach((itemIndex) => {
                copiedIngredients = copiedIngredients.filter(
                    (copyIngredient) => {
                        if (
                            copyIngredient.tagText !==
                            ingredients[itemIndex as number].tagText
                        ) {
                            return true;
                        }
                        return false;
                    }
                );
                copiedIngredients.unshift(ingredients[itemIndex as number]);
            });
            result = copiedIngredients.map((item, index) => {
                return (
                    <li
                        key={`item-tagtext-${item.id}`}
                        className={`product-tags__item ${
                            index < indexesOfIngredients.length
                                ? 'product-tags__item_searched'
                                : ''
                        }`}
                    >
                        {item.tagText}
                    </li>
                );
            });
        }
        return result;
    };

    return (
        <LazyMotion features={domMax} strict>
            <m.div
                className="recipe-card"
                ref={noderef}
                initial={{ opacity: 0.5, y: 15, scale: 0.96, display: 'none' }}
                layout
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    display: 'block',
                    transition: {
                        duration: 0.25,
                        delay: index * 0.05,
                        ease: easeOut,
                    },
                }}
                exit={{
                    opacity: 0,
                    y: 0,
                    scale: 0.8,
                    transition: {
                        duration: 0.4,
                        delay: 0,
                        ease: easeOut,
                        transitionEnd: {
                            display: 'none',
                        },
                    },
                }}
                onAnimationStart={() =>
                    setIsCardAnimateEnd && setIsCardAnimateEnd(false)
                }
                onTransitionEnd={() =>
                    setIsCardAnimateEnd && setIsCardAnimateEnd(true)
                }
            >
                <RemoveRecipeByAdmin id={id} />
                <div className="recipe-card__wrapper">
                    <NavLink
                        className="recipe-card__img-wrapper"
                        to={`/about-recepie/${id}`}
                    >
                        <LazyLoad width={290} height={290}>
                            <img
                                className="recipe-card__image"
                                width={290}
                                height={290}
                                src={previewImg?.src || ''}
                                alt={title}
                            />
                        </LazyLoad>
                    </NavLink>
                    <div className="recipe-card__content-text">
                        <h2 className="recipe-card__title" title={title}>
                            <NavLink to={`/about-recepie/${id}`}>
                                {title.length > 42
                                    ? `${title.substring(0, 42)}...`
                                    : title}
                            </NavLink>
                        </h2>
                        <div className="recipe-card__inner-wrapper">
                            {time.hours === '' && time.minutes === '' ? (
                                ''
                            ) : (
                                <span className={timerClass}>
                                    {time.hours ? `${time.hours} год` : ''}{' '}
                                    {time.minutes ? `${time.minutes} хв` : ''}
                                </span>
                            )}
                            <ul className="recipe-card__product-tags product-tags">
                                {renderedTags() || null}
                            </ul>
                        </div>
                    </div>
                    <div className="recipe-card__current-category">
                        {category}
                    </div>
                </div>
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
            </m.div>
        </LazyMotion>
    );
};

export default memo(RecipeListItem);
