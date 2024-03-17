import type { TagsType, Recipe } from '../../types/type';
import levenshteinDistance from './levenshteinDistance';

export type SearchedConstruction = {
    recipeIngredient: string;
    userSearchTag: string;
};

const filterByIngredients = (recipe: Recipe, searchTags: TagsType[]) => {
    let searchedConstruction: SearchedConstruction = {
        recipeIngredient: '',
        userSearchTag: '',
    };
    const result = searchTags.every((tag) => {
        return recipe.ingredients?.some((ingredient) => {
            const tagLower = tag.tagText.toLowerCase().trim();
            const ingredientLower = ingredient.tagText.toLowerCase().trim();
            const ingredientParts = ingredientLower.split(/[' '-]/g);
            const tagParts =
                tagLower.length > 1 ? tagLower.split(/[' '-]/g) : [tagLower];
            let result = false;
            ingredientParts.some((part) => {
                return tagParts.some((tagPart) => {
                    if (tagPart[0] !== part[0] || tagPart[1] !== part[1])
                        return false;
                    const distance = levenshteinDistance(part, tagPart);
                    result = distance <= part.length / 2.2;
                    searchedConstruction = {
                        recipeIngredient: part,
                        userSearchTag: tag.tagText,
                    };
                    if (part.includes(tagPart)) {
                        const str = part.replace(tagPart, '');
                        result = tagPart.length > str.length;
                        searchedConstruction = {
                            recipeIngredient: part,
                            userSearchTag: tag.tagText,
                        };
                    }
                    if (result) return true;
                    searchedConstruction = {
                        recipeIngredient: '',
                        userSearchTag: '',
                    };
                    return false;
                });
            });
            return result;
        });
    });
    return { isCorrect: result, searchedConstruction };
};

export default filterByIngredients;
