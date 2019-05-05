import {createStore, combineReducers, compose, applyMiddleware} from "redux"
import thunk from "redux-thunk"
import eventReducer from "./reducers/events.reducer"


//create a combine reducers.  Currently only events from eventReducer is here.  Will add reducers like users
const rootReducer = combineReducers({
    events: eventReducer
})

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))