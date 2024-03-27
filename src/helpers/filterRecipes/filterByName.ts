import type { Recipe } from '../../types/type';
import levenshteinDistance from './levenshteinDistance';

export type SearchedConstruction = {
    recipeIngredient: string;
    userSearchTag: string;
};

const filterByName = (recipe: Recipe, searchValue: string) => {
    let result = false;
    const { title } = recipe;
    const splittedTitle = title.toLowerCase().split(/[ -]/g);
    const splittedSearchValue = searchValue.toLowerCase().split(/[ -]/g);

    if (title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
        return { isCorrectValue: true };
    }

    splittedTitle.forEach((titlePart) => {
        splittedSearchValue.forEach((searchPart) => {
            if (
                titlePart[0] === searchPart[0] &&
                titlePart[1] === searchPart[1]
            ) {
                const distance = levenshteinDistance(titlePart, searchPart);
                if (distance <= titlePart.length / 2.2) {
                    result = true;
                }
            }
        });
    });

    return { isCorrectValue: result };
};

export default filterByName;
