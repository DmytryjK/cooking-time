import {useState, useEffect, ChangeEvent, Dispatch, SetStateAction} from 'react';
import nextId from 'react-id-generator';
import './CustomSelect.scss';

const CustomSelect = ({setValue, fieldValues, selectTitle} : {setValue: Dispatch<SetStateAction<string>>; fieldValues: string[]; selectTitle: string;}) => {
    const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>('');

    useEffect(() => {
        if(!selectedValue) return;
        setValue(selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        if (isCategoryActive) {
            document.addEventListener('click', closeSelect);
        }

        return () => document.removeEventListener('click', closeSelect);
    }, [isCategoryActive]);

    const closeSelect = (e: any) => {
        if (
            !e.target.closest('.custom-select__fields') &&
            !e.target.closest('.custom-select')
        ) {
            setIsCategoryActive(false);
        }
    };

    const toggleCategories = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setSelectedValue(target.value);
    };

  return (
    <div className={`custom-select ${isCategoryActive ? 'active' : ''}`}>
        <button
            className="custom-select__open-btn"
            type="button"
            onClick={() => setIsCategoryActive(!isCategoryActive)}
        >
            <span className="btn__text">{selectedValue || selectTitle}</span>{' '}
        </button>
        <fieldset
            className="custom-select__fields"
        >
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
  )
}

export default CustomSelect