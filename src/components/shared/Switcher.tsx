import React from "react";
import "./Styles/switcher.css";

interface SwitcherProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

const Switcher: React.FC<SwitcherProps> = ({ checked, onChange, id }) => {
  return (
    <div className="switcher">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => onChange()}
      />
      <label htmlFor={id} className="switch">
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default Switcher;
