import { useState, useEffect, useContext, createContext, Dispatch, SetStateAction } from 'react';
import nextId from 'react-id-generator';
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks';
import { addIngredientTags, setAllIngredients, clearAllTags } from '../../../../store/reducers/CreateRecipeFormSlice';
import { IngredientsType } from '../../../../types/type';
import Ingredient from './Ingredient/Ingredient';

type SelectUnitsType = {
    id: string | number,
    isOpen: boolean,
}

type SelectUnitsContextType = {
    selectedUnits: SelectUnitsType;
    setSelectedUnits: Dispatch<SetStateAction<SelectUnitsType>> | null;
}

export const SelectUnitContext = createContext<SelectUnitsContextType>({
    selectedUnits: {id: '', isOpen: false},
    setSelectedUnits: null,
});

const Ingredients = ({localingredients} : {localingredients?: IngredientsType[]}) => {
    const [tagName, setTagName] = useState<string>('');
    const [selectedUnits, setSelectedUnits] = useState<SelectUnitsType>({id: '', isOpen: false});
    const dispatch = useAppDispatch();
    const ingredients = useAppSelector(state => state.createRecipeForm.tags);

    useEffect(() => {
        if (localingredients) {
            dispatch(setAllIngredients(localingredients));
        } else {
            dispatch(clearAllTags());
        }
    }, [localingredients]);

    const handlePlusBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        changeTagsStatesOnEvent();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            changeTagsStatesOnEvent();
        }
    }

    const changeTagsStatesOnEvent = () => {
        if (tagName.length === 0) return;
        dispatch(addIngredientTags({
            id: nextId(`ingredient-${tagName}`),
            tagText: tagName,
            tagQuantityWithUnit: '',
            tagUnit: '',
        }));
        setTagName('');
    };

    return (
        <fieldset className="tagsForm">          
            <legend className="tagsForm__header form__label">Інгредієнти</legend>
            <div className="tagsForm__top-wrapper">
                <input 
                className="tagsForm__tagName form__input"
                name="Інгредієнти"
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyDown={handleKeyDown}/>
                <button
                    className="tagsForm__search-btn"
                    onClick={handlePlusBtn}
                    type="button"
                    aria-label="додати інгредієнт"
                    />
            </div>
            {ingredients.length === 0 ? '' : 
                <ul className="tagsForm__tagList">
                    {ingredients.map((ingredient, index) => {
                        const id = `${ingredient.id}-${index}`;
                        return (
                            <SelectUnitContext.Provider key={id} value={{selectedUnits, setSelectedUnits}}>
                                <Ingredient key={id} ingredient={ingredient} />
                            </SelectUnitContext.Provider>
                        )}
                    )}
                </ul>
            }
        </fieldset>
    )
}

export default Ingredients