import { useAppSelector } from '../../../hooks/hooks';
import './SearchResults.scss';

const SearchResults = () => {
    const searchValue = useAppSelector(
        (state) => state.recipes.searchedNameOfDishes
    );
    const tags = useAppSelector((state) => state.filters.searchTags);
    const filteredRecipes = useAppSelector(
        (state) => state.recipes.filteredRecipes
    );
    const filteredFavoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.filteredFavoriteRecipes
    );
    const isRequestCorrect =
        filteredRecipes.length > 0 || filteredFavoriteRecipes.length > 0;
    const renderResults = () => {
        let result;
        if (searchValue || tags.length > 0) {
            result = (
                <div className="search-results">
                    <h2 className="search-results__title">
                        Результати пошуку:
                    </h2>
                    {searchValue ? (
                        <span className="search-results__value-wrapper">
                            "
                            <span className="search-results__value">
                                {searchValue}
                            </span>
                            "
                        </span>
                    ) : (
                        ''
                    )}
                    {isRequestCorrect ? (
                        ''
                    ) : (
                        <span className="search-results__wrong-request">
                            нажаль ми нічого не знайшли :(
                        </span>
                    )}
                </div>
            );
        }
        return result || '';
    };

    return <>{renderResults()}</>;
};

export default SearchResults;
