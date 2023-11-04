import {
    useState,
    useEffect,
    SetStateAction,
    Dispatch,
    useContext,
} from 'react';
import nextId from 'react-id-generator';
import { SelectUnitContext } from '../../Ingredients';
import './SelectUnitsItem.scss';

const SelectUnitsItem = ({
    tagId,
    setUnit,
    tagUnit,
}: {
    tagId: string | number;
    setUnit: Dispatch<SetStateAction<string>>;
    tagUnit: string;
}) => {
    const units = ['г', 'кг', 'шт.', 'ч.л.', 'ст.л.', 'л', 'мл.'];
    const [isUnitsOpen, setIsUnitsOpen] = useState<boolean>(false);
    const [currentUnit, setCurrentUnit] = useState<string>(tagUnit || units[0]);

    const { selectedUnits, setSelectedUnits } = useContext(SelectUnitContext);

    useEffect(() => {
        setUnit(currentUnit);
    }, [currentUnit]);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.sort__custom-fields') &&
            !e.target.closest('.sort__custom-select')
        ) {
            setIsUnitsOpen(false);
        }
    };

    useEffect(() => {
        if (isUnitsOpen) {
            document.addEventListener('click', closeSelect);
            if (setSelectedUnits) {
                setSelectedUnits({
                    id: tagId,
                    isOpen: true,
                });
            }
        }
        return () => document.removeEventListener('click', closeSelect);
    }, [isUnitsOpen]);

    useEffect(() => {
        if (tagId !== selectedUnits.id) {
            setIsUnitsOpen(false);
        }
    }, [selectedUnits, tagId]);

    return (
        <div
            className={`sort__custom-select ${isUnitsOpen ? 'active' : ''}`}
            id={`${tagId}`}
        >
            <button
                className="sort__open-btn"
                type="button"
                onClick={() => setIsUnitsOpen(!isUnitsOpen)}
            >
                <span className="btn__text">{currentUnit}</span>{' '}
            </button>
            <fieldset className="sort__custom-fields">
                {units.map((unit, index) => {
                    return (
                        <div className="sort__field" key={nextId('units')}>
                            <input
                                className="sort__input"
                                name={tagId.toString()}
                                checked={unit === currentUnit}
                                type="radio"
                                id={`units-${tagId}${index}`}
                                value={unit}
                                onClick={() => setIsUnitsOpen(false)}
                                onChange={(e) => {
                                    setCurrentUnit(e.target.value);
                                    setIsUnitsOpen(false);
                                }}
                            />
                            <label
                                className="sort__label"
                                htmlFor={`units-${tagId}${index}`}
                            >
                                {unit}
                            </label>
                            <span className="sort__input-custom" />
                        </div>
                    );
                })}
            </fieldset>
        </div>
    );
};

export default SelectUnitsItem;
