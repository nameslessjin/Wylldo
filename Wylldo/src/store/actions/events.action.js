import {ADD_EVENT, GET_POSTS} from "./actionTypes"
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
export const getPosts = (posts) => {
    console.log(posts)

    return{
        type: GET_POSTS,
        Posts: posts
    }
}