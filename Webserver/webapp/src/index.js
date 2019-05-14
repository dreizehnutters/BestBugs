import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie';
import { HashRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { Provider } from "react-redux";
import * as redux from "redux";
import * as ReduxUtils from "./reduxUtils";
  

function configure() {
    let store = redux.createStore(
        ReduxUtils.reduceFct,
        ReduxUtils.INITIAL_STATE,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // allows seeing the Redux Store with this extension: http://extension.remotedev.io/
    );
  
    registerServiceWorker();
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/app/service-worker.js", {
    //       scope: "/app/"
    //     })
    //     .then(function(registration) {
    //       console.log("Registration successful, scope is:", registration.scope);
    //     })
    //     .catch(function(error) {
    //       console.log("Service worker registration failed, error:", error);
    //     });
    //}
    return store;
  }

const store = configure();
//Allows access to store in console.log
window.store = store;

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </CookiesProvider>
    </Provider>, document.getElementById('root'));
