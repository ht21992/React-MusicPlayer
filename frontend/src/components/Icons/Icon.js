import React from "react";
import classNames from "classnames";
const Icon = ({ iconName, iconId, iconType, onClick }) => {
  return (
    <div className="control" onClick={onClick}>
      <div className={iconType} id={iconId}>
        <i className={classNames("fas", iconName)}></i>
      </div>
    </div>
  );
};

export default Icon;
