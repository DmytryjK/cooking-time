import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import nextId from 'react-id-generator';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
    addSearchTag,
    searchInputValue,
    deleteAllTags,
} from '../../../store/reducers/FiltersSlice';
import loader from '../../../assets/icons/loader/loader.svg';
import { filterRecipes } from '../../../store/reducers/RecipesListSlice';
import { filterFavoriteRecipes } from '../../../store/reducers/FavoritesRecipesSlice';
import CustomSelect from '../../CustomSelect/CustomSelect';
import debounce from '../../../helpers/debounce';
import './SearchForm.scss';
import { Loading } from '../../../types/type';

const SearchForm = () => {
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const [inputValue, setInputValue] = useState<string>('');
    const [isSearchLoading, setIsSearchLoading] = useState<Loading>('idle');
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

    const debounceSearch = useCallback(
        debounce((searchInput, searchTags, searchCategories) => {
            dispatch(
                filterRecipes({ searchInput, searchTags, searchCategories })
            );
            dispatch(
                filterFavoriteRecipes({
                    searchInput,
                    searchTags,
                    searchCategories,
                })
            );
        }, 400),
        []
    );

    const debouncedSearchName = useCallback(
        debounce((inputValue) => {
            dispatch(searchInputValue(inputValue));
            setIsSearchLoading('succeeded');
        }, 400),
        []
    );

    useEffect(() => {
        debounceSearch(searchInput, searchTags, searchCategories);
    }, [searchInput, searchTags, searchCategories]);

    useEffect(() => {
        setInputValue('');
    }, [selectedOption]);

    useEffect(() => {
        setInputValue('');
        dispatch(searchInputValue(''));
        dispatch(deleteAllTags());
    }, [pathname]);

    useEffect(() => {
        searchTypes.some((type) => {
            if (type.title === selectedOption) {
                if (type.id === 1) return undefined;
                setIsSearchLoading('pending');
                debouncedSearchName(inputValue);
            }
            return undefined;
        });
    }, [inputValue, selectedOption]);

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
                {inputValue && (
                    <button
                        className="searchForm__searchByName_clear-btn"
                        type="button"
                        aria-label="очистити пошук"
                        title="очистити пошук"
                        onClick={() => setInputValue('')}
                    >
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_709_732)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.79214 0.79214C1.01499 0.569287 1.37631 0.569287 1.59916 0.79214L9.20786 8.40084C9.43071 8.62369 9.43071 8.98501 9.20786 9.20786C8.98501 9.43071 8.62369 9.43071 8.40084 9.20786L0.79214 1.59916C0.569287 1.37631 0.569287 1.01499 0.79214 0.79214Z"
                                    fill="#D24A34"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.20786 0.79214C9.43071 1.01499 9.43071 1.37631 9.20786 1.59916L1.59916 9.20786C1.37631 9.43071 1.01499 9.43071 0.79214 9.20786C0.569287 8.98501 0.569287 8.62369 0.79214 8.40084L8.40084 0.79214C8.62369 0.569287 8.98501 0.569287 9.20786 0.79214Z"
                                    fill="#D24A34"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_709_732">
                                    <rect width="10" height="10" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                )}
                <button
                    className="searchForm__searchBtn"
                    type="button"
                    onClick={() => handleSearchClick(inputValue)}
                >
                    {isSearchLoading !== 'pending' ? (
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
                    ) : (
                        ''
                    )}
                    {isSearchLoading === 'pending' ? (
                        <img
                            className="searchForm__loading"
                            src={loader}
                            alt=""
                        />
                    ) : (
                        ''
                    )}
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
