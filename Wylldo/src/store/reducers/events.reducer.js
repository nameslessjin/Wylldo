import {ADD_EVENT} from "../actions/actionTypes"
import defaultImg from "../../assets/Savannah.jpeg"

const initialState = {
    Events: [{
        description: "best party in town",
        tag: "md-beer",
        coords: {
            latitude: 40.798599,
            longitude: -77.856654
        },
        image: {uri: defaultImg},
        key: 1
    },
    {
        description: "Rock climbing.  Everyone join me!",
        tag: "md-american-football",
        coords: {
            latitude: 40.794000,
            longitude: -77.859954
        },
        image: {uri: defaultImg},
        key: 2

    }]
}

export default reducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_EVENT:
            return{
                ...state,
                Events: state.Events.concat(action.EventInfo)
            }
        default:
            return state
    }
}