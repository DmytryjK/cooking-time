import {
    useState,
    useEffect,
    ChangeEvent,
    Dispatch,
    SetStateAction,
} from 'react';
import nextId from 'react-id-generator';
import './CustomSelect.scss';

const CustomSelect = ({
    value,
    setValue,
    fieldValues,
    selectTitle,
    isShowCurrentOption,
    initialCheckedValue,
}: {
    value?: string;
    setValue: Dispatch<SetStateAction<string>>;
    fieldValues: string[];
    selectTitle: string;
    isShowCurrentOption?: boolean;
    initialCheckedValue?: string;
}) => {
    const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('');

    useEffect(() => {
        if (value === undefined) return;
        if (value === '') {
            setSelectedValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (!selectedValue) return;
        setValue(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        if (!initialCheckedValue) return;
        setSelectedValue(initialCheckedValue);
    }, [initialCheckedValue]);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.custom-select__fields') &&
            !e.target.closest('.custom-select')
        ) {
            setIsCategoryActive(false);
        }
    };

    useEffect(() => {
        if (isCategoryActive) {
            document.addEventListener('click', closeSelect);
        }

        return () => document.removeEventListener('click', closeSelect);
    }, [isCategoryActive]);

    const toggleCategories = (e: ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        setSelectedValue(target.value);
    };

    return (
        <div className={`custom-select ${isCategoryActive ? 'active' : ''}`}>
            <button
                className="custom-select__open-btn"
                type="button"
                onClick={() => setIsCategoryActive(!isCategoryActive)}
            >
                <span className="btn__text">
                    {isShowCurrentOption
                        ? selectedValue || selectTitle
                        : selectTitle}
                </span>{' '}
            </button>
            <fieldset className="custom-select__fields">
                {fieldValues.map((category) => {
                    const id = nextId(`${category}`);
                    return (
                        <div className="custom-select__field" key={id}>
                            <input
                                className="custom-select__input"
                                id={id}
                                type="checkbox"
                                value={category}
                                onChange={toggleCategories}
                                checked={category === selectedValue}
                            />
                            <label
                                className="custom-select__label"
                                htmlFor={id}
                            >
                                {category}
                            </label>
                            <span className="custom-select__input-custom" />
                        </div>
                    );
                })}
            </fieldset>
        </div>
    );
};

CustomSelect.defaultProps = {
    isShowCurrentOption: true,
    initialCheckedValue: '',
};

export default CustomSelect;
