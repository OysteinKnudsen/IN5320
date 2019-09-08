import React, { useState, useEffect } from "react";
import "./App.css";
import { QuoteBox } from "../QuoteBox/QuoteBox";
import { Header } from "../Header/Header";
import { NextGuessButton } from "../NextGuessButton/NextGuessButton";
import { GuessButton } from "../GuessButton/GuessButton";

function App() {
  const [quoteSourceNumber, setSource] = React.useState(null);
  const [guessedSourceNumber, setGuess] = React.useState(null);
  const [result, setResult] = React.useState("");

  useEffect(() => {
    if (guessedSourceNumber !== quoteSourceNumber) {
      setResult("You suck!");
    } else {
      setResult("Good guessing!");
    }
  }, [guessedSourceNumber]);
  document.title = "Quote guessing game!";
  return (
    <div id="app-container">
      <Header />
      <QuoteBox quoteSourceNumber={quoteSourceNumber} />
      <div id="button-container">
        <GuessButton
          text="This must be Trump!"
          guessValue={1}
          setGuess={setGuess}
        />
        <GuessButton
          text="This must be Kanye!"
          guessValue={2}
          setGuess={setGuess}
        />
        <GuessButton
          text="This must be Ron Swanson!"
          guessValue={3}
          setGuess={setGuess}
        />
        <NextGuessButton
          setSource={setSource}
          setGuess={setGuess}
          setResult={setResult}
        >
          {" "}
        </NextGuessButton>

        <h3>{result}</h3>
      </div>
    </div>
  );
}

export default App;
