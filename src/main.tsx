import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.scss'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
console.log("loading Maestro Web");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
