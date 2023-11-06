import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nextId from 'react-id-generator';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
    addSearchTag,
    searchInputValue,
    deleteAllTags,
} from '../../../store/reducers/FiltersSlice';
import { filterRecipes } from '../../../store/reducers/RecipesListSlice';
import CustomSelect from '../../CustomSelect/CustomSelect';
import './SearchForm.scss';

const SearchForm = () => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const [inputValue, setInputValue] = useState<string>('');
    const { searchInput, searchTags, searchCategories } = useAppSelector(
        (state) => state.filters
    );
    const [selectedOption, setSelectedOption] = useState('');
    const searchTypes = [
        {
            id: 1,
            title: 'По інгредієнтам',
        },
        {
            id: 2,
            title: 'По стравам',
        },
    ];
    const selectFields = searchTypes.map((field) => field.title);

    useEffect(() => {
        dispatch(filterRecipes({ searchInput, searchTags, searchCategories }));
    }, [searchInput, searchTags, searchCategories]);

    useEffect(() => {
        setInputValue('');
    }, [selectedOption]);

    useEffect(() => {
        setInputValue('');
        setSelectedOption('');
        dispatch(searchInputValue(''));
        dispatch(deleteAllTags());
    }, [pathname]);

    const handleSearchClick = (value: string) => {
        dispatch(searchInputValue(value));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            searchTypes.some((type) => {
                if (type.title === selectedOption) {
                    if (type.id === 1) {
                        if (!inputValue) return undefined;
                        event.preventDefault();
                        dispatch(
                            addSearchTag({
                                id: nextId('createdTag'),
                                tagText: inputValue,
                            })
                        );
                        setInputValue('');
                    } else {
                        dispatch(searchInputValue(inputValue));
                    }
                }
                return undefined;
            });
        }
    };

    return (
        <div className="searchForm">
            <div className="searchForm__input-wrapper">
                <input
                    className="searchForm__searchByName"
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={`Пошук ${selectedOption.toLowerCase()}...`}
                />
                <button
                    className="searchForm__searchBtn"
                    type="button"
                    onClick={() => handleSearchClick(inputValue)}
                >
                    <svg
                        className="searchForm__searchBtn-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 19"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="1">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.25 3.5C5.3505 3.5 3 5.8505 3 8.75C3 11.6495 5.3505 14 8.25 14C11.1495 14 13.5 11.6495 13.5 8.75C13.5 5.8505 11.1495 3.5 8.25 3.5ZM1.5 8.75C1.5 5.02208 4.52208 2 8.25 2C11.9779 2 15 5.02208 15 8.75C15 12.4779 11.9779 15.5 8.25 15.5C4.52208 15.5 1.5 12.4779 1.5 8.75Z"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.957 12.457C12.2499 12.1641 12.7247 12.1641 13.0176 12.457L16.2801 15.7195C16.573 16.0124 16.573 16.4872 16.2801 16.7801C15.9872 17.073 15.5124 17.073 15.2195 16.7801L11.957 13.5176C11.6641 13.2247 11.6641 12.7499 11.957 12.457Z"
                            />
                        </g>
                    </svg>
                </button>
                <CustomSelect
                    setValue={setSelectedOption}
                    fieldValues={selectFields}
                    selectTitle="Тип"
                    isShowCurrentOption={false}
                    initialCheckedValue="По стравам"
                />
            </div>
        </div>
    );
};

export default SearchForm;
