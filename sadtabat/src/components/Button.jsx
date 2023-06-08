import React from "react";
import "../CSS/button.css"
import { Link } from "react-router-dom";

const Button = ({ text, url }) => {
  return (
    <Link href={url}>
      <button className="buttons">{text}</button>
    </Link>
  );
};

export default Button;
