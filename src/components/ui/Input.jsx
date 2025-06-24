import React from "react";

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 ${
        props.className || ""
      }`}
    />
  );
}
