import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER, SIGN_OUT, UPDATE_USER} from "./actionTypes"
import Fire from '../../firebase/Fire'
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

export const signOut = () => {
    return{
        type: SIGN_OUT
    }
}

export const getCurrentUser = (currentUserData) => {

    return{
        type: GET_CURRENTUSER,
        currentUserData: currentUserData
    }
}

export const updateUserdata = (updatedUserdata) => {

    return{
        type: UPDATE_USER,
        updatedUser: updatedUserdata
    }
}