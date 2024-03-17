import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { filterRecipes } from '../../../store/reducers/RecipesListSlice';
import { activeCategories } from '../../../store/reducers/FiltersSlice';
import debounce from '../../../helpers/debounce';
import './SortByCategories.scss';

const SortByCategories = ({
    currentPage,
}: {
    currentPage: 'MAIN' | 'FAVORITES';
}) => {
    const [isSelectActive, setIsSelectActive] = useState<boolean>(false);
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
    const { searchInput, searchTags, searchCategories } = useAppSelector(
        (state) => state.filters
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const recipes = useAppSelector((state) => state.recipes.recipes);
    const favoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.favoriteRecipes
    );
    const [listOfCategories, setListOfCategories] = useState<string[]>([]);
    const dispatch = useAppDispatch();

    const debounceFilter = useCallback(
        debounce((searchInput, searchTags, searchCategories) => {
            dispatch(
                filterRecipes({ searchInput, searchTags, searchCategories })
            );
        }, 400),
        []
    );

    useEffect(() => {
        if (currentPage === 'MAIN' && recipes.length > 0) {
            setListOfCategories(
                Array.from(new Set(recipes.map((recipe) => recipe.category)))
            );
        }
        if (currentPage === 'FAVORITES' && favoriteRecipes.length > 0) {
            setListOfCategories(
                Array.from(
                    new Set(favoriteRecipes.map((recipe) => recipe.category))
                )
            );
        }
    }, [recipes, favoriteRecipes]);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.sort__custom-fields') &&
            !e.target.closest('.sort__custom-select')
        ) {
            setIsSelectActive(false);
        }
    };

    useEffect(() => {
        if (isSelectActive) {
            document.addEventListener('click', closeSelect);
        }

        return () => document.removeEventListener('click', closeSelect);
    }, [isSelectActive]);

    useEffect(() => {
        if (isFilterActive) {
            debounceFilter(searchInput, searchTags, searchCategories);
        }
    }, [searchCategories, isFilterActive]);

    useEffect(() => {
        dispatch(activeCategories(selectedCategories));
    }, [selectedCategories]);

    const toggleCategories = (e: ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        if (target.checked) {
            setSelectedCategories((prev) => [...prev, target.value]);
        } else {
            setSelectedCategories((prev) =>
                [...prev].filter((item) => item !== target.value)
            );
        }
    };

    return (
        <div className="sort">
            <div
                className={`sort__custom-select ${
                    isSelectActive ? 'active' : ''
                }`}
            >
                <button
                    className="sort__open-btn"
                    type="button"
                    onClick={() => setIsSelectActive(!isSelectActive)}
                >
                    <span className="btn__text">Категорії</span>{' '}
                </button>
                <fieldset className="sort__custom-fields">
                    {' '}
                    {listOfCategories.map((category, index) => {
                        return (
                            <div
                                className="sort__field"
                                key={`category-sort-${category}`}
                            >
                                <input
                                    className="sort__input"
                                    id={`sort-${category}`}
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.some(
                                        (selectedName) =>
                                            selectedName === category
                                    )}
                                    onClick={() => {
                                        setIsFilterActive(true);
                                    }}
                                    onChange={toggleCategories}
                                />
                                <label
                                    className="sort__label"
                                    htmlFor={`sort-${category}`}
                                >
                                    {category}
                                </label>
                                <span className="sort__input-custom" />
                            </div>
                        );
                    })}
                    {selectedCategories.length > 0 ? (
                        <button
                            className="sort__accept-btn"
                            type="button"
                            onClick={() => {
                                setIsFilterActive(true);
                                setSelectedCategories([]);
                            }}
                        >
                            Очистити фільтри
                        </button>
                    ) : (
                        ''
                    )}
                </fieldset>
            </div>
        </div>
    );
};

export default SortByCategories;
