import { useState, useEffect } from 'react';
import {
    updateIngredientInfoById,
    deleteIngredientTags,
} from '../../../../../store/reducers/CreateRecipeFormSlice';
import { useAppDispatch } from '../../../../../hooks/hooks';
import SelectUnitsItem from './SelectUnitsItem/SelectUnitsItem';
import { IngredientsType } from '../../../../../types/type';

const Ingredient = ({ ingredient }: { ingredient: IngredientsType }) => {
    const { id, tagText, tagUnit, tagQuantityWithUnit } = ingredient;

    const [tagQuantity, setTagQuantity] = useState<string>(tagQuantityWithUnit);
    const [tagUnitLocal, setTagUnitLocal] = useState<string>(tagUnit);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!tagUnitLocal) return;
        dispatch(
            updateIngredientInfoById({
                id,
                tagText,
                tagUnit: tagUnitLocal,
                tagQuantityWithUnit: tagQuantity,
            })
        );
    }, [tagQuantity, tagUnitLocal]);

    return (
        <li className="tagsForm__createdTag createdTag">
            <span>{tagText}</span>
            <label className="createdTag__label">
                <input
                    className="createdTag__input"
                    type="number"
                    placeholder="10"
                    value={tagQuantity}
                    onChange={(e) => {
                        setTagQuantity(e.target.value);
                    }}
                />
                <SelectUnitsItem
                    tagId={id}
                    setUnit={setTagUnitLocal}
                    tagUnit={tagUnitLocal}
                />
                <button
                    className="createdTag__delete-ingredient"
                    type="button"
                    onClick={() => dispatch(deleteIngredientTags(id))}
                >
                    видалити
                </button>
            </label>
        </li>
    );
};

export default Ingredient;
