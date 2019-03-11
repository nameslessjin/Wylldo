import {ADD_EVENT, GET_EVENT} from "./actionTypes"

export const addEvent = (EventInfo) => {
    return{
        type: ADD_EVENT,
        EventInfo: EventInfo
    }
}

