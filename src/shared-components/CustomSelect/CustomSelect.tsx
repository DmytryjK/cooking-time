import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction, RefObject } from "react";
import nextId from "react-id-generator";
import "./CustomSelect.scss";

const CustomSelect = ({
  value,
  setValue,
  fieldValues,
  selectTitle,
  isShowCurrentOption,
  initialCheckedValue,
  isOpen = false,
  setIsOpen,
  searchRef,
  isButtonVisible,
}: {
  value?: string;
  setValue: Dispatch<SetStateAction<string>>;
  fieldValues: string[];
  selectTitle: string;
  isShowCurrentOption?: boolean;
  initialCheckedValue?: string;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  searchRef?: RefObject<HTMLInputElement>;
  isButtonVisible?: boolean;
}) => {
  const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(initialCheckedValue || "");

  useEffect(() => {
    setIsCategoryActive(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (value === undefined) return;
    if (value === "") {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!selectedValue) return;
    setValue(selectedValue);
  }, [selectedValue]);

  const closeSelect = (e: any) => {
    if (
      !e.target.closest(".custom-select__fields") &&
      !e.target.closest(".custom-select") &&
      !e.target.closest(".searchForm__searchByName")
    ) {
      setIsCategoryActive(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isCategoryActive) {
      document.addEventListener("click", closeSelect);
    }

    return () => document.removeEventListener("click", closeSelect);
  }, [isCategoryActive]);

  const toggleCategories = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    setSelectedValue(target.value);
    setIsCategoryActive(false);
    if (setIsOpen) setIsOpen(false);
    searchRef?.current?.focus();
  };

  return (
    <div className={`custom-select ${isCategoryActive ? "active" : ""}`}>
      {(isButtonVisible || isButtonVisible === undefined) && (
        <button
          className="custom-select__open-btn"
          type="button"
          onClick={() => {
            setIsCategoryActive(!isCategoryActive);
            if (setIsOpen) {
              setIsOpen(!isOpen);
            }
          }}
        >
          <span className="btn__text">{isShowCurrentOption ? selectedValue || selectTitle : selectTitle}</span>{" "}
        </button>
      )}
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
              <label className="custom-select__label" htmlFor={id}>
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
  initialCheckedValue: "",
};

export default CustomSelect;
