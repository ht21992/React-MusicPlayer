import React from "react";
import { getClasses } from "../../utils/getClasses";

const Button = ({btnText, btnType, classes, onClick, ...rest}) => {

  var btnclasses = getClasses([classes]);

  return (
    <button className={btnclasses} type={btnType} onClick={onClick} {...rest}>
      {btnText}
    </button>
  );
};


Button.defaultProps = {
    btnType: "button",
    btnText: "Button",
    classes: "",
    onClick: () => null,
  };


export default Button;
