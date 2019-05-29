import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER, SIGN_OUT, UPDATE_USER, GET_MAPEVENTS, LOAD_MORE_EVENTS, DELETE_EVENT} from "./actionTypes"

//I want to put connect with firebase here.  However without a state, promise having format trouble to store information

//get already upload event data and add to the top of current loaded event data instead of freshing.  Maybe should be replaced with listener
export const addEvent = (eventInfo) => {
    return{
        type: ADD_EVENT,
        EventInfo: eventInfo
    }

}

export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId: eventId
    }
}

//get already retreieved events as parameter and pass to reducers to store them
export const getEvents = (events) => {
    return{
        type: GET_EVENTS,
        Events: events
    }
}

export const loadMoreEvents = (events) => {
    return {
        type: LOAD_MORE_EVENTS,
        Events: events
    }
}

export const getMapEvents = (mapEvents) => {
    return{
        type: GET_MAPEVENTS,
        mapEvents: mapEvents
    }
}

//simply signout to clean current user data and loaded events
export const signOut = () => {
    return{
        type: SIGN_OUT
    }
}

//get already retreived currentUser data as parameter and pass to reducer to store it
export const getCurrentUser = (currentUserData) => {
    return{
        type: GET_CURRENTUSER,
        currentUserData: currentUserData
    }
}

//get already updated current user data as parameter and pass to reducer to store it
export const updateUserdata = (updatedUserdata) => {
    return{
        type: UPDATE_USER,
        updatedUser: updatedUserdata
    }
}