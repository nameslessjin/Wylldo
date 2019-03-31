import {ADD_EVENT, GET_EVENTS} from "../actions/actionTypes"
import defaultImg from "../../assets/Savannah.jpeg"
//Somewhere have state load events, load from firebase
const initialState = {
    Events: []
}

export default reducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_EVENT:
            return{
                ...state,
                Events: state.Events.concat(action.EventInfo)
            }
        case GET_EVENTS:
            return{
                ...state,
                Events: state.Events.concat(action.Events)
            }
        default:
            return state
    }
}