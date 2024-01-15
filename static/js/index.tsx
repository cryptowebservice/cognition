import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import './styles/index.scss';

window.addEventListener('message', () => {
    if (process.env.NODE_ENV !== 'production') {
        // console.clear();
    }
});

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
