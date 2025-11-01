import React from "react";

// Button component to display a styled button with customizable text and click behavior
const Button = ({ styles, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-4 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}
  >
    {children} {/* Displays the content inside the button */}
  </button>
);

export default Button;
