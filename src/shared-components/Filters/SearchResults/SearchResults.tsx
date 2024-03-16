import { useAppSelector } from '../../../hooks/hooks';
import './SearchResults.scss';

const SearchResults = () => {
    const searchValue = useAppSelector(
        (state) => state.recipes.searchedNameOfDishes
    );
    const filteredRecipes = useAppSelector(
        (state) => state.recipes.filteredRecipes
    );
    const filteredFavoriteRecipes = useAppSelector(
        (state) => state.favoriteRecipes.filteredFavoriteRecipes
    );
    const isRequestCorrect =
        filteredRecipes.length || filteredFavoriteRecipes.length;

    const renderResults = () => {
        let result;
        if (searchValue) {
            result = (
                <div className="search-results">
                    <h2 className="search-results__title">
                        Результати пошуку:
                    </h2>
                    <span className="search-results__value-wrapper">
                        "
                        <span className="search-results__value">
                            {searchValue}
                        </span>
                        "
                    </span>
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
