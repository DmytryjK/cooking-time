import { Dispatch, SetStateAction, useState, useRef } from "react";
import nextId from "react-id-generator";

const Unit = ({
  unit,
  tagId,
  isChecked,
  setIsUnitsOpen,
  setCurrentUnit,
  isUnitFocused,
}: {
  unit: string | number;
  tagId: string | number;
  isChecked: boolean;
  setIsUnitsOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentUnit: Dispatch<SetStateAction<string>>;
  isUnitFocused: boolean;
}) => {
  const [checked, setChecked] = useState(isChecked);
  const inputId = `units-${tagId}-${nextId()}`;
  const unitRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sort-unit__field">
      <input
        className="sort-unit__input"
        name={tagId.toString()}
        checked={checked}
        type="radio"
        id={inputId}
        ref={unitRef}
        value={unit}
        onClick={() => {
          setIsUnitsOpen(false);
          setChecked(true);
        }}
        onChange={(e) => {
          setCurrentUnit(e.target.value);
          setIsUnitsOpen(false);
        }}
      />
      <label className={`sort-unit__label ${isUnitFocused ? "focused" : ""}`} htmlFor={inputId}>
        {unit}
      </label>
    </div>
  );
};

export default Unit;
