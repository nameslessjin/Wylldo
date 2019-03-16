import {ADD_EVENT, GET_EVENT} from "./actionTypes"
import Firestore from '../../firebase/Fire'


export const addEvent = (EventInfo, image) => {
    Firestore.addEvent(EventInfo, image)
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