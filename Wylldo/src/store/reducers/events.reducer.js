import {ADD_EVENT, GET_EVENTS, GET_CURRENTUSER, SIGN_OUT, UPDATE_USER, GET_MAPEVENTS, LOAD_MORE_EVENTS} from "../actions/actionTypes"

//This is reducers for events.  Currently support Add_event, Get_Event, Get_CurrentUser, Signout and Update_user
//This reducer is not connect to firebase.  Data is retrieved from somewhere else and then store here and later
//retribute through store.
//Will move get_CurrentUser, Signout and update_user to a userdata reducer
const initialState = {
    Events: [],
    currentUser: null,
    mapEvents: []
}

export default reducer = (state = initialState, action) => {
    switch (action.type){

        //add newly added event on the top of retrieved events to avoid refresh (maybe should be replaced with listener)
        case ADD_EVENT:
            const mapEventData = [{
                coords: action.EventInfo[0].coords,
                tag: action.EventInfo[0].tag,
                hostAvatar: action.EventInfo[0].hostAvatar,
                eventId: action.EventInfo[0].id,
                likes: action.EventInfo[0].likes,
                startTime: action.EventInfo[0].startTime,
                endTime: action.EventInfo[0].endTime,
                eventId: action.EventInfo[0].key,
                key: action.EventInfo[0].key
            }]
            const updateEvents = action.EventInfo.concat(state.Events)
            const updateMapEvents = mapEventData.concat(state.mapEvents)
            return{
                ...state,
                Events: updateEvents,
                mapEvents: updateMapEvents
            }
        
        case GET_MAPEVENTS:
            return{
                ...state,
                mapEvents: state.mapEvents.concat(action.mapEvents)
            }

        //store retrieved events through firebase and then store to state so it can be used with redux connected screen
        case GET_EVENTS:
            return{
                ...state,
                Events: action.Events
            }

        case LOAD_MORE_EVENTS:
            return{
                ...state,
                Events: state.Events.concat(action.Events)
            }

        //store retrieved currently login user and store to state so it can be used with redux connected screen
        case GET_CURRENTUSER:
            return{
                ...state,
                currentUser: action.currentUserData
            }

        //after signout, empty events and set current User to null so that the next log in won't have previous user's information and events
        case SIGN_OUT:
            return{
                Events: [],
                currentUser: null
            }
        
        //no event is changed.  current user information like profile picture if updated and store immediately to avoid extra read
        case UPDATE_USER:
            return{
                ...state,
                currentUser: action.updatedUser
            }
        default:
            return state
    }
}