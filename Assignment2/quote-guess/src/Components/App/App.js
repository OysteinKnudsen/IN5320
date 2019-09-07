import React, { useState, useEffect } from "react";
import "./App.css";
import { QuoteBox } from "../QuoteBox/QuoteBox";
import { Header } from "../Header/Header";
import { NextGuessButton } from "../NextGuessButton/NextGuessButton";
import { GuessButton } from "../GuessButton/GuessButton";

function App() {
  const [quoteSourceNumber, setSource] = React.useState(null);

  return (
    <div id="app-container">
      <Header />
      <QuoteBox quoteSourceNumber={quoteSourceNumber} />
      <GuessButton text="This must be trump!" />
      <GuessButton text="This must be Kanye!" />
      <NextGuessButton setSource={setSource}> </NextGuessButton>
    </div>
  );
}

export default App;
