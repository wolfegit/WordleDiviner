/*
This program is free software: you can redistribute it and/or modify it 
under the terms of the GNU General Public License as published by the 
Free Software Foundation, either version 3 of the License, or 
(at your option) any later version.

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

See the GNU General Public License for more details.
*/

import React, { useState } from 'react';
  
const App = () => {
  const [state, setState] = useState('');
    
  const handler = (event) => {
      // changing the state to the name of the key
    // which is pressed
    setState(event.key);
  };
    
  return (
    <div>
      <h1>Hi Geeks!</h1>
        
<p>The KEY pressed in the input box is: {state}</p>
        
      {/* Passing the key pressed to the handler function */}
      <input type="text" onKeyPress={(e) => handler(e)} />
        
    </div>
  );
};
  
export default App;