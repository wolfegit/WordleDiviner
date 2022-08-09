import React from 'react';
//import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import './App.css';
import {GrepDictionaryFile} from "./GrepDictionary";

function App() {
  // React binding syntax, callback method technique
  //     Variable       Callable Method                   Initial Value
  //     🔽             🔽                                🔽 
  const [greenLetters,  SetGreenLetters]      = useState(".....");
  const [yellowLetters, SetYellowLetters]     = useState(".....");
  const [greyLetters,   SetGreyLetters]       = useState(".....");
  const [errors,        SetErrors]            = useState("");
  const [grepResults,   SetGrepResults]       = useState("");
  const [lastKey, SetLastKey] = useState(() => "");

  const KeyHandler = (event) => {
      SetLastKey(event.key);
      //console.log(event.key);
      var result = new GrepDictionaryFile(greenLetters.toLowerCase(), yellowLetters.toLowerCase(), greyLetters.toLowerCase());
      result
      .then((message) => {
        SetGrepResults(message);
        SetErrors("");
       })
      .catch((message) => {
        SetErrors(message);
        SetGrepResults("");
      })
      .finally((message) => {
        // finally runs no matter what. 
      }); // promise
    } // keyHandler 


  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle Diviner</h1>
        <table>
          <tbody>
            <tr>
              <td className="green"> <label className="green" htmlFor="greenInput">Green Letters:</label> </td>
              <td>  <input id="GreenInput" value={greenLetters} onKeyUp={(e) => KeyHandler(e)} onChange={(e) => SetGreenLetters(e.target.value)} type="text" maxLength="5" /> </td>
            </tr>
            <tr>
              <td className="yellow"> <label className="yellow" htmlFor="YellowInput">Yellow Letters:</label></td>
              <td> <input id="YellowInput" value={yellowLetters} onKeyUp={(e) => KeyHandler(e)} onChange={(e) => SetYellowLetters(e.target.value)} type="text" maxLength="5" /> </td>
            </tr>
            <tr>
              <td className="grey"> <label className="grey" htmlFor="GreyInput">Grey Letters:</label></td>
              <td> <input id="GreyInput" value={greyLetters} onKeyUp={(e) => KeyHandler(e)} onChange={(e) => SetGreyLetters(e.target.value)} type="text" /> </td>
            </tr>
            <tr>
              <td> <label htmlFor="Error">Error:</label></td>
              <td> <textarea id="Error" value={errors} type="text" readOnly></textarea> </td>
            </tr>
            <tr>
              <td> <label htmlFor="Results">Results Found:</label> </td>
              <td> <textarea id="Results" type="text" value={grepResults} readOnly /> </td> 
            </tr>
            
          </tbody>
        </table>
        
      </header>
    </div>
    
  );
}

export default App;
