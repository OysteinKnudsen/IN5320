import React, { useState, useEffect } from "react";
import "./GuessButton.css";

export const GuessButton = ({ text, guessValue, setGuess }) => {
  const onClick = () => {
    setGuess(guessValue);
  };
  return (
    <button className="guess-button" id={guessValue} onClick={onClick}>
      {text}
    </button>
  );
};
