import {
    useState,
    useEffect,
    createContext,
    Dispatch,
    SetStateAction,
    useMemo,
} from 'react';
import nextId from 'react-id-generator';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import {
    addIngredientTags,
    setAllIngredients,
    clearAllTags,
} from '../../../../store/reducers/CreateRecipeFormSlice';
import { IngredientsType } from '../../../../types/type';
import Ingredient from './Ingredient/Ingredient';
import './Ingredients.scss';

type SelectUnitsType = {
    id: string | number;
    isOpen: boolean;
};

type SelectUnitsContextType = {
    selectedUnits: SelectUnitsType;
    setSelectedUnits: Dispatch<SetStateAction<SelectUnitsType>> | null;
};

export const SelectUnitContext = createContext<SelectUnitsContextType>({
    selectedUnits: { id: '', isOpen: false },
    setSelectedUnits: null,
});

const Ingredients = ({
    localingredients,
}: {
    localingredients: IngredientsType[] | undefined;
}) => {
    const [tagName, setTagName] = useState<string>('');
    const [selectedUnits, setSelectedUnits] = useState<SelectUnitsType>({
        id: '',
        isOpen: false,
    });
    const [duplicatedValues, setDuplicatedValues] = useState<(string | null)[]>(
        []
    );
    const dispatch = useAppDispatch();
    const ingredients = useAppSelector((state) => state.createRecipeForm.tags);
    const contextValue = useMemo(
        () => ({ selectedUnits, setSelectedUnits }),
        [selectedUnits, setSelectedUnits]
    );

    useEffect(() => {
        if (localingredients) {
            dispatch(setAllIngredients(localingredients));
        } else {
            dispatch(clearAllTags());
        }
    }, [localingredients]);

    useEffect(() => {
        if (ingredients.length > 1) {
            setDuplicatedValues([
                ...new Set(
                    ingredients
                        .map((item, index) => {
                            if (
                                ingredients.some(
                                    (ingredient, ingIndex) =>
                                        ingredient.tagText.toLowerCase() ===
                                            item.tagText.toLowerCase() &&
                                        ingIndex !== index
                                )
                            ) {
                                return item.tagText.toLowerCase();
                            }
                            return null;
                        })
                        .filter((item) => item !== null)
                ),
            ]);
        } else {
            setDuplicatedValues([]);
        }
    }, [ingredients]);

    const changeTagsStatesOnEvent = () => {
        if (tagName.length === 0) return;
        dispatch(
            addIngredientTags({
                id: nextId(`ingredient-${tagName}`),
                tagText: tagName,
                tagQuantityWithUnit: '',
                tagUnit: '',
            })
        );
        setTagName('');
    };

    const handlePlusBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        changeTagsStatesOnEvent();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            changeTagsStatesOnEvent();
        }
    };

    return (
        <fieldset className="tagsForm">
            <legend className="tagsForm__header form__label">
                Інгредієнти
            </legend>
            <div className="tagsForm__top-wrapper">
                <input
                    className="tagsForm__tagName form__input"
                    name="Інгредієнти"
                    type="text"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="tagsForm__search-btn"
                    onClick={handlePlusBtn}
                    type="button"
                    aria-label="додати інгредієнт"
                />
            </div>
            {ingredients.length === 0 ? (
                ''
            ) : (
                <ul className="tagsForm__tagList tagsForm__tagList_ingredients">
                    {ingredients.map((ingredient) => {
                        const id = `${ingredient.id}`;
                        return (
                            <SelectUnitContext.Provider
                                key={id}
                                value={contextValue}
                            >
                                <Ingredient key={id} ingredient={ingredient} />
                            </SelectUnitContext.Provider>
                        );
                    })}
                </ul>
            )}
            {duplicatedValues.length > 0 ? (
                <div className="duplicated-block">
                    <p>Ви записали декілька однакових інгредієнтів:</p>
                    <ul className="duplicated-list">
                        {' '}
                        {duplicatedValues.map((item, index) => {
                            return (
                                <li
                                    className="duplicated-list__item"
                                    key={nextId(item)}
                                >
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
        </fieldset>
    );
};

export default Ingredients;
