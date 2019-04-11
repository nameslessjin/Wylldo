import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER} from "./actionTypes"
import Firestore from '../../firebase/Fire'
import {AsyncStorage} from 'react-native'


export const addEvent = (eventInfo) => {

    return{
        type: ADD_EVENT,
        EventInfo: eventInfo,
    }

}


export const getEvents = (events) => {

    return{
        type: GET_EVENTS,
        Events: events
    }
}

export const getCurrentUser = (currentUserData) => {

    return{
        type: GET_CURRENTUSER,
        currentUserData: currentUserData
    }
}