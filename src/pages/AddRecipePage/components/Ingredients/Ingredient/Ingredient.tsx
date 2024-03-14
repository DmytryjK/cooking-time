import { useState, useEffect } from 'react';
import {
    updateIngredientInfoById,
    deleteIngredientTags,
} from '../../../../../store/reducers/CreateRecipeFormSlice';
import { useAppDispatch } from '../../../../../hooks/hooks';
import SelectUnitsItem from './SelectUnitsItem/SelectUnitsItem';
import { IngredientsType } from '../../../../../types/type';
import './Ingredient.scss';

const Ingredient = ({ ingredient }: { ingredient: IngredientsType }) => {
    const { id, tagText, tagUnit, tagQuantityWithUnit } = ingredient;
    const [inputTagText, setInputTagText] = useState(tagText);
    const [tagQuantity, setTagQuantity] = useState<string>(tagQuantityWithUnit);
    const [tagUnitLocal, setTagUnitLocal] = useState<string>(tagUnit);
    const dispatch = useAppDispatch();

    const handleCheckInput = () => {
        if (tagQuantity) {
            const regex = /[^\d.]+|(?<=\d)\.(?!\d)/g;
            const replaced = tagQuantity.replace(regex, '');
            setTagQuantity(replaced);
        }
    };

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
            <input
                className="createdTag__input-title"
                type="text"
                value={inputTagText}
                onChange={(e) => setInputTagText(e.target.value)}
                onBlur={() => {
                    dispatch(
                        updateIngredientInfoById({
                            id,
                            tagText: inputTagText,
                            tagUnit: tagUnitLocal,
                            tagQuantityWithUnit: tagQuantity,
                        })
                    );
                }}
            />
            {/* <span>{tagText}</span> */}
            <label className="createdTag__label">
                <input
                    className="createdTag__input"
                    type="text"
                    placeholder="10"
                    value={tagQuantity}
                    onChange={(e) => {
                        setTagQuantity(e.target.value);
                    }}
                    onBlur={handleCheckInput}
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
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.22917 0.916229L9.12037 0.916121C8.60777 0.915355 8.15786 0.914684 7.75697 1.07235C7.40644 1.21022 7.09612 1.43388 6.85448 1.72283C6.57813 2.05329 6.43649 2.48032 6.27512 2.96686L6.24082 3.07011L6.12545 3.41623H3.33268H1.66602C1.2518 3.41623 0.916016 3.75202 0.916016 4.16623C0.916016 4.58044 1.2518 4.91623 1.66602 4.91623H2.6255L3.07477 12.5537L3.07647 12.5826C3.13179 13.5232 3.17569 14.2696 3.25531 14.8726C3.33679 15.4897 3.4617 16.0121 3.70705 16.4927C4.20545 17.4689 5.02616 18.2428 6.03001 18.683C6.52418 18.8997 7.05305 18.9937 7.67385 19.0388C8.28042 19.0829 9.02807 19.0829 9.97013 19.0829H9.97018H9.97024H9.97029H9.99935H10.0284H10.0285H10.0285H10.0286C10.9706 19.0829 11.7183 19.0829 12.3249 19.0388C12.9457 18.9937 13.4745 18.8997 13.9687 18.683C14.9725 18.2428 15.7932 17.4689 16.2916 16.4927C16.537 16.0121 16.6619 15.4897 16.7434 14.8726C16.823 14.2696 16.8669 13.5233 16.9222 12.5829L16.9222 12.5828L16.9222 12.5827L16.9239 12.5537L17.3732 4.91623H18.3327C18.7469 4.91623 19.0827 4.58044 19.0827 4.16623C19.0827 3.75202 18.7469 3.41623 18.3327 3.41623H16.666H13.8733L13.7579 3.07011L13.7236 2.96686C13.5622 2.48032 13.4206 2.05329 13.1442 1.72283C12.9026 1.43388 12.5923 1.21022 12.2417 1.07235C11.8408 0.914684 11.3909 0.915355 10.8783 0.916121L10.7695 0.916229H9.22917ZM13.3152 4.91623C13.3268 4.9165 13.3383 4.9165 13.35 4.91623H15.8706L15.4265 12.4656C15.3691 13.4415 15.3279 14.1336 15.2563 14.6762C15.1857 15.2109 15.0916 15.5444 14.9557 15.8106C14.6147 16.4786 14.0531 17.0081 13.3663 17.3093C13.0925 17.4293 12.7541 17.5037 12.2162 17.5428C11.6703 17.5824 10.977 17.5829 9.99935 17.5829C9.02171 17.5829 8.32843 17.5824 7.78254 17.5428C7.24462 17.5037 6.90617 17.4293 6.63242 17.3093C5.94557 17.0081 5.38404 16.4786 5.04303 15.8106C4.90711 15.5444 4.81301 15.2109 4.7424 14.6762C4.67076 14.1336 4.62959 13.4415 4.57218 12.4656L4.1281 4.91623H6.64875C6.66036 4.9165 6.67194 4.9165 6.6835 4.91623H13.3152ZM12.2919 3.41623C12.1102 2.87635 12.0579 2.76201 11.9935 2.6851C11.913 2.58878 11.8096 2.51422 11.6927 2.46827C11.5924 2.42883 11.4556 2.41623 10.7695 2.41623H9.22917C8.54314 2.41623 8.40625 2.42883 8.30598 2.46827C8.18914 2.51422 8.0857 2.58878 8.00515 2.6851C7.94083 2.76201 7.88853 2.87635 7.70678 3.41623H12.2919ZM9.08268 8.3329C9.08268 7.91868 8.7469 7.5829 8.33268 7.5829C7.91847 7.5829 7.58268 7.91868 7.58268 8.3329V14.1662C7.58268 14.5804 7.91847 14.9162 8.33268 14.9162C8.7469 14.9162 9.08268 14.5804 9.08268 14.1662V8.3329ZM11.666 7.5829C12.0802 7.5829 12.416 7.91868 12.416 8.3329V11.6662C12.416 12.0804 12.0802 12.4162 11.666 12.4162C11.2518 12.4162 10.916 12.0804 10.916 11.6662V8.3329C10.916 7.91868 11.2518 7.5829 11.666 7.5829Z"
                            fill="#292929"
                        />
                    </svg>
                </button>
            </label>
        </li>
    );
};

export default Ingredient;
