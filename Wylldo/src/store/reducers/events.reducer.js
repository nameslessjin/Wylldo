import {POST_EVENT, GET_EVENTS, GET_CURRENTUSER, 
        SIGN_OUT, UPDATE_USER, GET_MAPEVENTS, 
        LOAD_MORE_EVENTS, DELETE_EVENT, ON_FOLLOW,
        GET_COMMENT, POST_COMMENT, DELETE_COMMENT,
        LOAD_JOINEDUSER, UPDATE_JOINEDUSER_EVENT
        } from "../actions/actionTypes"

//This is reducers for events.  Currently support Add_event, Get_Event, Get_CurrentUser, Signout and Update_user
//This reducer is not connect to firebase.  Data is retrieved from somewhere else and then store here and later
//retribute through store.
//Will move get_CurrentUser, Signout and update_user to a userdata reducer
const initialState = {
    Events: [],
    currentUser: {},
    mapEvents: [],
    mapEventIdList: [],
    comment: [],
    joinedUser: []
}

export default reducer = (state = initialState, action) => {
    switch (action.type){

        //add newly added event on the top of retrieved events to avoid refresh (maybe should be replaced with listener)
        case POST_EVENT:
            const mapEventData = [{
                tag: action.EventInfo[0].tag,
                hostAvatar: action.EventInfo[0].hostAvatar,
                eventId: action.EventInfo[0].id,
                likes: action.EventInfo[0].likes,
                startTime: action.EventInfo[0].startTime,
                endTime: action.EventInfo[0].endTime,
                coords: action.EventInfo[0].geoCoordinates,
                key: action.EventInfo[0].key,
                createdTime: action.EventInfo[0].timestamp,
                location: action.EventInfo[0].location.coords,
                eventTag: action.EventInfo[0].eventTag
            }]
            const updateEvents = action.EventInfo.concat(state.Events)
            const updateMapEvents = mapEventData.concat(state.mapEvents)
            const updateMapEventIdList = [[action.EventInfo[0].timestamp, action.EventInfo[0].key]].concat(state.mapEventIdList)
            return{
                ...state,
                Events: updateEvents,
                mapEvents: updateMapEvents, 
                mapEventIdList: updateMapEventIdList 
            }
        
        case UPDATE_JOINEDUSER_EVENT:
            const {eventId, joinUserIds} = action.updateInfo
            for (event of state.Events){
                if (event.eventId == eventId){
                    event.joinedNum = joinUserIds.length + 1
                    event.join_userIDs = joinUserIds
                }
            }

            return{
                ...state
            }

        case LOAD_JOINEDUSER:
            return{
                ...state,
                joinedUser: action.joinedUser
            }

        case GET_COMMENT:
            const comment = action.comment
            return{
                ...state,
                comment: comment
            }
        
        case POST_COMMENT:{
            let comment = [...state.comment]
            comment.push(action.comment)
            return{
                ...state,
                comment: comment
            }
        }

        case DELETE_COMMENT:{
            let comment = [...state.comment]
            comment = comment.filter(comment => {
                return comment.commentId !== action.commentId
            })
            return{
                ...state,
                comment: comment
            }
        }

        case ON_FOLLOW:
            return{
                ...state,
                currentUser: action.user
            }
        
        case DELETE_EVENT:
            let updatedEvents = [...state.Events]
            updatedEvents = updatedEvents.filter(event => {
                return event.eventId !== action.eventId
            })

            let updatedMapEvents = [...state.mapEvents]
            updatedMapEvents = updatedMapEvents.filter(event => {
                return event.eventId !== action.eventId
            })


        return{
            ...state,
            Events: updatedEvents,
            mapEvents: updatedMapEvents,
        }
        
        case GET_MAPEVENTS:
            let mapEventIdList = []
            action.mapEvents.forEach(doc => {
                const eventArray = [new Date(doc.createdTime), doc.eventId]
                mapEventIdList.push(eventArray)
            })

            mapEventIdList.sort((a, b) => {
                return (b[0] - a[0])
            })
            return{
                ...state,
                mapEvents: action.mapEvents,
                mapEventIdList: mapEventIdList
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
                currentUser: {},
                mapEvents: [],
                mapEventIdList: [],
                createdEvents: [],
                likedEvents: [],
                joinedEvents: []
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