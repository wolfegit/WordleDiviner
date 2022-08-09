// WORKS
// Substitute for App.js to see it work

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