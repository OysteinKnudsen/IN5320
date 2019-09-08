import React from "react";
import "./NextGuessButton.css";

export const NextGuessButton = ({ setSource, setGuess, setResult }) => {
  const onClick = () => {
    const number = getRandomInt(1, 3);
    setResult(null);
    setSource(number);
    console.log("OnClick");
  };

  return (
    <button id="next-guess-button" onClick={onClick}>
      Next quote
    </button>
  );
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
