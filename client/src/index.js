import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as process from 'process';

import App from './App';
import rootReducer from './reducers';
import './index.css';

// Ensure process is available globally (some libraries may depend on it)
window.process = process;

// Configure Redux store
const store = configureStore({
  reducer: rootReducer,
});

// Get the root DOM element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the React app with Redux Provider
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
