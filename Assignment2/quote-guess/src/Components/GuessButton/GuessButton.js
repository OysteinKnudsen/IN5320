import React, { useState, useEffect } from "react";
import "./GuessButton.css";

export const GuessButton = ({ text, guessValue }) => {
  return (
    <button className="guess-button" id={guessValue}>
      {text}
    </button>
  );
};
