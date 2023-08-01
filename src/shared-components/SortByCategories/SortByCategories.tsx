import {useState, useEffect, ChangeEvent} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { filterRecipes } from '../../store/reducers/RecipesListSlice';
import { activeCategories } from '../../store/reducers/FiltersSlice';
import Tags from '../Tags/Tags';
import './SortByCategories.scss';

const SortByCategories = () => {
    const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFilterActive, setIsFilterActive] = useState<boolean>(false);
    const {searchInput, searchTags, searchCategories} = useAppSelector(state => state.filters);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isCategoryActive) {
            document.addEventListener('click', closeSelect);
        }

        return () => document.removeEventListener('click', closeSelect);
    }, [isCategoryActive]);

    useEffect(() => {
        if (!isFilterActive) return;
        dispatch(activeCategories(selectedCategories));
    }, [isFilterActive]);

    useEffect(() => {
        setIsFilterActive(false);
    }, [selectedCategories]);

    useEffect(() => {
        dispatch(filterRecipes({searchInput, searchTags, searchCategories}));
    }, [searchCategories]);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.sort__custom-fields') &&
            !e.target.closest('.sort__custom-select')
        ) {
            setIsCategoryActive(false);
        }
    };

    const toggleCategories = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        if (target.checked) {
            setSelectedCategories((prev) => [...prev, target.value])
        } else {
            setSelectedCategories((prev) => [...prev].filter(item => item !== target.value))
        }
    };

    return (
        <div className="sort">
            <div className={`sort__custom-select ${isCategoryActive ? 'active' : ''}`}>
                <button
                    className="sort__open-btn"
                    type="button"
                    onClick={() => setIsCategoryActive(!isCategoryActive)}
                >
                    <span className="btn__text">Категорії</span>{' '}
                </button>
                <fieldset
                    className="sort__custom-fields"
                >
                    <div className="sort__field">
                        <input
                            className="sort__input"
                            id="sort-1"
                            type="checkbox"
                            value="Перші страви"
                            onChange={toggleCategories}
                        />
                        <label
                            className="sort__label"
                            htmlFor="sort-1"
                        >
                            Перші страви
                        </label>
                        <span className="sort__input-custom" />
                    </div>
                    <div className="sort__field">
                        <input
                            className="sort__input"
                            id="sort-2"
                            type="checkbox"
                            value="Десерти"
                            onChange={toggleCategories}
                        />
                        <label
                            className="sort__label"
                            htmlFor="sort-2"
                        >
                            Десерти
                        </label>
                        <span className="sort__input-custom" />
                    </div>
                    <div className="sort__field">
                        <input
                            className="sort__input"
                            id="sort-3"
                            type="checkbox"
                            value="Випічка"
                            onChange={toggleCategories}
                        />
                        <label className="sort__label" htmlFor="sort-3">
                            Випічка
                        </label>
                        <span className="sort__input-custom" />
                    </div>
                    <div className="sort__field">
                        <input
                            className="sort__input"
                            id="sort-4"
                            type="checkbox"
                            value="Гарнір"
                            onChange={toggleCategories}
                        />
                        <label className="sort__label" htmlFor="sort-4">
                            Гарнір
                        </label>
                        <span className="sort__input-custom" />
                    </div>
                    <button className="sort__accept-btn" onClick={() => setIsFilterActive(true)} >Показати</button>
                </fieldset>
            </div>
        </div>
    )
}

export default SortByCategories;
