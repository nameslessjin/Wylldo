import {ADD_EVENT, GET_EVENTS} from "./actionTypes"
import Firestore from '../../firebase/Fire'


export const addEvent = (EventInfo, image) => {
    Firestore.addEvent(EventInfo, image)
    // Firestore.addPhoto(image)
    return{
        type: ADD_EVENT,
        EventInfo: EventInfo
    }
}

//add picture tab description
export const getEvents = (events) => {

    return{
        type: GET_EVENTS,
        Events: events
    }
}