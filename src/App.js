/*global chrome*/
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
    let currentTabId = useRef(0);
    const [highlightedElements, setHighlightedElements] = useState([]);

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'SHOW_ELEMENTS') {
                setHighlightedElements(message.elements);
            }
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]) {
            currentTabId.current = tab.id;
        });
    }, [highlightedElements]);

    const deleteElement = (index) => {
        chrome.tabs.sendMessage(currentTabId.current, { action: 'DELETE_ELEMENT', elementId: index });
    };

    return (
        <div className="App">
            <ul className="highlighted-list">
                {highlightedElements.map((element, index) => (
                    <li key={index}>
                        <span>{element.name}</span>
                        <button onClick={() => deleteElement(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
