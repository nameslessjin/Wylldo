import {ADD_EVENT, GET_EVENT} from "./actionTypes"


export const addEvent = (EventInfo) => {
    console.log(EventInfo)
    return{
        type: ADD_EVENT,
        EventInfo: EventInfo
    }
}

//add picture tab description
export const initializeEvent = (eventState) => {
    console.log(eventState)

    return{
        type: GET_EVENT
    }
}