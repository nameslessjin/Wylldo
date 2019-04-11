import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER} from "../actions/actionTypes"
//Somewhere have state load events, load from firebase
const initialState = {
    Events: [],
    currentUser: null
}

export default reducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_EVENT:
            const updateEvents = action.EventInfo.concat(state.Events)
            return{
                ...state,
                Events: updateEvents
            }
        case GET_EVENTS:
            return{
                ...state,
                Events: state.Events.concat(action.Events)
            }
        case GET_CURRENTUSER:
            return{
                ...state,
                currentUser: action.currentUserData
            }
        default:
            return state
    }
}