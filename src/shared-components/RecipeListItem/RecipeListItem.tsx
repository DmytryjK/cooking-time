import LazyLoad from 'react-lazy-load';
import { useRef, Dispatch, SetStateAction, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    deleteRecipe,
    localRemoveRecipe,
} from '../../store/reducers/RecipesListSlice';
import loader from '../../assets/icons/loader/loader.svg';
import { Recipe } from '../../types/type';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
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
    const [isRemoveActive, setIsRemoveActive] = useState(false);
    const { pathname } = useLocation();

    const previewImg = imgDto.find((img) => img.id === 'previewImg');
    const timerClass = time
        ? 'recipe-card__timer active'
        : 'recipe-card__timer';
    const { uid, isAdmin } = useAppSelector(
        (state) => state.authentication.user
    );
    const removeRecipeLoading = useAppSelector(
        (state) => state.recipes.removeRecipeLoading
    );
    const navigate = useNavigate();
    const noderef = useRef(null);
    const notesRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const handledeleteRecipe = () => {
        if (!id) return;
        dispatch(deleteRecipe(id)).then(() => dispatch(localRemoveRecipe(id)));
    };

    useEffect(() => {
        if (!notesRef.current) return undefined;
        const handleCloseNote = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                !target.closest(
                    `.${notesRef.current?.className.split(' ')[0]}` || ''
                )
            ) {
                setIsRemoveActive(false);
            }
        };
        if (isRemoveActive) {
            setTimeout(() => {
                window.addEventListener('click', handleCloseNote);
            }, 0);
        } else {
            window.removeEventListener('click', handleCloseNote);
        }
        return () => window.removeEventListener('click', handleCloseNote);
    }, [isRemoveActive]);

    const renderedTags = ingredients?.map((item) => {
        return (
            <li key={`item-tagtext-${item.id}`} className="product-tags__item">
                {item.tagText}
            </li>
        );
    });

    return (
        <div className="recipe-card" ref={noderef}>
            {isAdmin ? (
                <button
                    className="recipe-card__remove-recipe"
                    type="button"
                    aria-label="видалити рецепт"
                    title="видалити рецепт"
                    onClick={() => setIsRemoveActive(true)}
                >
                    {removeRecipeLoading !== 'pending' ? (
                        <svg
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="Icons/close">
                                <path
                                    id="Vector (Stroke)"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.79214 1.29214C1.01499 1.06929 1.37631 1.06929 1.59916 1.29214L9.20786 8.90084C9.43071 9.12369 9.43071 9.48501 9.20786 9.70786C8.98501 9.93071 8.62369 9.93071 8.40084 9.70786L0.79214 2.09916C0.569287 1.87631 0.569287 1.51499 0.79214 1.29214Z"
                                    fill="#D24A34"
                                />
                                <path
                                    id="Vector (Stroke)_2"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.20786 1.29214C9.43071 1.51499 9.43071 1.87631 9.20786 2.09916L1.59916 9.70786C1.37631 9.93071 1.01499 9.93071 0.79214 9.70786C0.569287 9.48501 0.569287 9.12369 0.79214 8.90084L8.40084 1.29214C8.62369 1.06929 8.98501 1.06929 9.20786 1.29214Z"
                                    fill="#D24A34"
                                />
                            </g>
                        </svg>
                    ) : (
                        <img
                            className="recipe-card__remove-loading"
                            src={loader}
                            alt=""
                        />
                    )}
                </button>
            ) : (
                ''
            )}
            <CSSTransition
                nodeRef={notesRef}
                in={isRemoveActive === true}
                timeout={200}
                unmountOnExit
                classNames="recipe-card__confirmation-remove-notes"
            >
                <div
                    className="recipe-card__confirmation-remove-notes"
                    ref={notesRef}
                >
                    Ви впевнені, що хочете назавжди видалити цей рецепт?
                    <div className="recipe-card__btns-wrapper">
                        <button
                            type="button"
                            onClick={() => {
                                handledeleteRecipe();
                                setIsRemoveActive(false);
                            }}
                        >
                            Видалити
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRemoveActive(false)}
                        >
                            Закрити
                        </button>
                    </div>
                </div>
            </CSSTransition>
            <NavLink className="recipe-card__link" to={`/about-recepie/${id}`}>
                <div className="recipe-card__img-wrapper">
                    <LazyLoad width={290}>
                        <img
                            className="recipe-card__image"
                            width={290}
                            height={290}
                            src={previewImg?.src || ''}
                            alt={title}
                        />
                    </LazyLoad>
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
    );
};

export default RecipeListItem;
