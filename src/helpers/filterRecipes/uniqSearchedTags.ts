import type { SearchedConstruction } from './filterByIngredients';

const uniqSearchedTags = (searchedWord: SearchedConstruction[]) => {
    const uniqSearchedTags: SearchedConstruction[] = [];
    searchedWord.forEach((word, index) => {
        const { userSearchTag, recipeIngredient } = word;
        if (index === 0) {
            uniqSearchedTags.push(word);
        } else if (
            !uniqSearchedTags.some(
                (uniqTag) =>
                    uniqTag.recipeIngredient === recipeIngredient &&
                    uniqTag.userSearchTag === userSearchTag
            )
        ) {
            uniqSearchedTags.push(word);
        }
    });
    return uniqSearchedTags;
};

export default uniqSearchedTags;
