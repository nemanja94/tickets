import React from "react";

interface CheckItemCheckboxProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const CheckItemCheckbox: React.FC<CheckItemCheckboxProps> = ({
  name,
  checked,
  onChange,
  label,
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label htmlFor={name}>{label || name}</label>
  </div>
);

export default CheckItemCheckbox;
