import React from "react";

const Input = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
};

Input.defaultProps = {
  type: "text",
  label: "Label",
  name: "input",
  onChange: () => null,
};

export default Input;
