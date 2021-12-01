import React, { useState } from 'react';
import PdfUserInterface from './pdf/PdfUserInterface';

import './App.css';

export const App = () => {
    const [ customText, setCustomText ] = useState('bottom text');

    return (
        <div id="app">
            <p>
                <span>Input custom text: </span>
                <input type="text" value={customText} onChange={(evt) => setCustomText(evt.target.value)} />
            </p>
            <PdfUserInterface customText={customText} />
        </div>
    );
};

export default App;
