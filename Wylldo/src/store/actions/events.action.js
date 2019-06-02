import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER, 
        SIGN_OUT, UPDATE_USER, GET_MAPEVENTS, 
        LOAD_MORE_EVENTS, DELETE_EVENT, GET_CREATEDEVENTS, 
        LOAD_MORE_CREATEDEVENTS, GET_LIKEDEVENTS, LOAD_MORE_LIKEDEVENTS,
        GET_JOINEDEVENTS, LOAD_MORE_JOINEDEVENTS
        } from "./actionTypes"

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

export const getCreatedEvents = (createdEvents) => {
    return {
        type: GET_CREATEDEVENTS,
        createdEvents: createdEvents
    }
}

export const loadMoreCreatedEvents = (createdEvents) => {
    return{
        type: LOAD_MORE_CREATEDEVENTS,
        createdEvents: createdEvents
    }
}

export const getJoinedEvents = (joinedEvents) => {
    return{
        type: GET_JOINEDEVENTS,
        joinedEvents: joinedEvents
    }
}

export const loadMoreJoinedEvents = (joinedEvents) => {
    return{
        type: LOAD_MORE_JOINEDEVENTS,
        joinedEvents: joinedEvents
    }
}

export const getLikedEvents = (likedEvents) => {
    return {
        type: GET_LIKEDEVENTS,
        likedEvents: likedEvents
    }
}

export const loadMoreLikedEvents = (likedEvents) => {
    return{
        type: LOAD_MORE_LIKEDEVENTS,
        likedEvents: likedEvents
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