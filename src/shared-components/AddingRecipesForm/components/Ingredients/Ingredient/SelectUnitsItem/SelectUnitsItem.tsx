import {
    useState,
    useEffect,
    SetStateAction,
    Dispatch,
    useContext,
    useRef,
    KeyboardEvent,
} from 'react';
import nextId from 'react-id-generator';
import { SelectUnitContext } from '../../Ingredients';
import Unit from './Unit/Unit';
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
    const units = [
        'гр',
        'кг',
        'л',
        'мл.',
        'шт.',
        'ч.л.',
        'ст.л.',
        'зубч.',
        'стак.',
    ];
    const [isUnitsOpen, setIsUnitsOpen] = useState<boolean>(false);
    const [currentUnit, setCurrentUnit] = useState<string>(tagUnit || units[0]);
    const [searchUnitValue, setSearchUnitValue] = useState('');
    const [filteredUnits, setFilteredUnits] = useState(units);
    const [isUnitFocused, setIsUnitFocused] = useState<string>('');

    const { selectedUnits, setSelectedUnits } = useContext(SelectUnitContext);
    const selectRef = useRef<HTMLButtonElement>(null);
    const fieldsetRef = useRef<HTMLFieldSetElement>(null);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.sort-unit__custom-fields') &&
            !e.target.closest('.sort-unit')
        ) {
            setIsUnitsOpen(false);
        }
    };

    useEffect(() => {
        setUnit(currentUnit);
    }, [currentUnit]);

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
        if (selectRef.current && window.visualViewport && fieldsetRef.current) {
            const bottomDistance =
                window.visualViewport.height -
                selectRef.current.getBoundingClientRect().bottom;
            const fieldsetHeight =
                fieldsetRef.current.getBoundingClientRect().height;
            fieldsetRef.current.style.setProperty('--unitSelectHeight', 'auto');
            if (bottomDistance > 0 && fieldsetHeight > bottomDistance) {
                fieldsetRef.current.style.setProperty(
                    '--unitSelectHeight',
                    `${Math.floor(bottomDistance) - 20}px`
                );
            }
        }
        return () => document.removeEventListener('click', closeSelect);
    }, [isUnitsOpen]);

    useEffect(() => {
        if (isUnitsOpen && searchUnitValue) {
            setSearchUnitValue('');
        }
    }, [isUnitsOpen, currentUnit]);

    useEffect(() => {
        if (tagId !== selectedUnits.id) {
            setIsUnitsOpen(false);
        }
    }, [selectedUnits, tagId]);

    useEffect(() => {
        if (searchUnitValue) {
            const filteredUnits = units.filter((unit) =>
                unit.startsWith(searchUnitValue)
            );
            setFilteredUnits(filteredUnits);
            setIsUnitFocused(filteredUnits[0]);
        } else {
            setFilteredUnits(units);
            setCurrentUnit(tagUnit || units[0]);
            setIsUnitFocused('');
        }
    }, [searchUnitValue]);

    const keydownInput = (e: KeyboardEvent<HTMLInputElement>) => {
        if (
            (e.key === 'Enter' || e.code === 'Enter') &&
            filteredUnits.length > 0
        ) {
            setCurrentUnit(isUnitFocused || filteredUnits[0]);
            setIsUnitsOpen(false);
        }

        if (
            (e.key === 'ArrowDown' || e.code === 'ArrowDown') &&
            filteredUnits.length > 0
        ) {
            setIsUnitFocused((prev) => {
                if (!filteredUnits[filteredUnits.indexOf(prev) + 1])
                    return prev;
                return filteredUnits[filteredUnits.indexOf(prev) + 1];
            });
        }

        if (
            (e.key === 'ArrowUp' || e.code === 'ArrowUp') &&
            filteredUnits.length > 0
        ) {
            setIsUnitFocused((prev) => {
                if (!filteredUnits[filteredUnits.indexOf(prev) - 1])
                    return prev;
                return filteredUnits[filteredUnits.indexOf(prev) - 1];
            });
        }
    };

    return (
        <div
            className={`sort-unit ${isUnitsOpen ? 'active' : ''}`}
            id={`${tagId}`}
        >
            <button
                className="sort-unit__open-btn"
                type="button"
                ref={selectRef}
                onClick={() => setIsUnitsOpen(!isUnitsOpen)}
            >
                <span className="btn__text">{currentUnit}</span>{' '}
                <input
                    className={`sort-unit__search-input ${
                        isUnitsOpen ? 'active' : ''
                    }`}
                    type="text"
                    value={searchUnitValue}
                    onChange={(e) => setSearchUnitValue(e.target.value)}
                    onKeyDown={keydownInput}
                />
            </button>
            <fieldset className="sort-unit__custom-fields" ref={fieldsetRef}>
                {filteredUnits.map((unit) => {
                    return (
                        <Unit
                            key={nextId('units')}
                            unit={unit}
                            tagId={tagId}
                            isChecked={unit === (tagUnit || units[0])}
                            setIsUnitsOpen={setIsUnitsOpen}
                            setCurrentUnit={setCurrentUnit}
                            isUnitFocused={isUnitFocused === unit}
                        />
                    );
                })}
            </fieldset>
        </div>
    );
};

export default SelectUnitsItem;
