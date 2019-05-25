import firebase from 'react-native-firebase'
import uuid from 'uuid'
import uploadPhoto from '../firebase/uploadPhoto'
import {GeoCollectionReference, GeoFirestore, GeoQuery, GeoDocumentReference} from 'geofirestore'
import geohash from 'ngeohash'

class Fire {

    constructor(){
        firebase.auth().onAuthStateChanged(user => {
            // console.log(user)
        })
    }

    //Download Data
    // get data here for wylldoList
    getEvents = async ({size, start}) => {
        let ref = this.eventsCollection.orderBy('timestamp', 'desc').limit(size);
        try{
            if(start){
                ref = ref.startAfter(start)
            }
        
            const querySnapshot = await ref.get();
            const eventData = []
            querySnapshot.forEach(doc => {
                if (doc.exists){
                    const event = doc.data() || {}
                    const eventWithKey = {
                        key: doc.id,
                        eventId: doc.id,
                        ...event
                    }
                eventData.push(eventWithKey)
                }
            })
            // console.log(eventData)
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            // console.log(lastVisible)
            return {eventData, cursor: lastVisible}
        } catch(error){
            console.log(error.message)
        }
    }

    getEventsWithId = async(eventId) => {
        let ref = this.eventsCollection.doc(eventId)
        const querySnapshot = await ref.get();
        return querySnapshot.data()
        
    }

    //used to get location and tag for the map.
    getMapEvents = async() => {
        let ref = firebase.firestore().collection('mapEvents')
        const querySnapshot = await ref.get()
        const mapEventsData = []
        querySnapshot.forEach(doc => {
            if(doc.exists){
                const mapEvent = doc.data() || {}
                const mapEventsWithKey = {
                    key: doc.id,
                    ...mapEvent,
                    eventId: doc.id
                }
                mapEventsData.push(mapEventsWithKey)
            }
        })
        // console.log(mapEventsData)

        return mapEventsData
    }

    // Upload Data
    addEvent = async(EventInfo, image) => {
   
        const imgStorageUri = !(image === null) ? await this.uploadPhotoAsync(image.uri) : null
        const uploadedImag =  !(image === null) ? {
            ...image,
            uri: imgStorageUri
        } : null

        const uploadEventInfo = {
            ...EventInfo,
            image: uploadedImag,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            like_userIDs: [],
            joinedNum: 1,
            geoCoordinates: (EventInfo.coords.latitude) ? new firebase.firestore.GeoPoint(EventInfo.coords.latitude, EventInfo.coords.longitude) : null,
            geoHash: (EventInfo.coords.latitude) ? geohash.encode(EventInfo.coords.latitude, EventInfo.coords.longitude, precision=10) : null
        }

        const createdEvent = await this.eventsCollection.add(uploadEventInfo).catch(error => console.log(error))
        
        const updateEventInfo = [{
            ...uploadEventInfo,
            key: createdEvent.id,
            eventId: createdEvent.id
        }]

        // let updateMapEventData = null
        // if (uploadEventInfo.location){
        //     const mapEventData = {
        //         tag: uploadEventInfo.tag,
        //         hostAvatar: uploadEventInfo.hostAvatar,
        //         eventId: createdEvent.id,
        //         likes: uploadEventInfo.likes,
        //         startTime: uploadEventInfo.startTime,
        //         endTime: uploadEventInfo.endTime,
        //         coordinates: new firebase.firestore.GeoPoint(EventInfo.coords.latitude, EventInfo.coords.longitude)
        //     }

        //     const createMapEvent = await this.geoDB.collection('mapEvents').doc(createdEvent.id).set(mapEventData).then(result => console.log(result))
        //     .catch(error => {console.log(error)})

        //     updateMapEventData = [{
        //         d:{
        //             ...mapEventData
        //         },
        //         l: mapEventData.coordinates,
        //         key: createdEvent.id,
        //         eventId: createdEvent.id
        //     }]

        // }


        // console.log(updateEventInfo, updateMapEventData)


        return updateEventInfo
    }

    //an event is liked, add to user document
    onLikeEvent = async(eventId) => {
        const eventRef = this.eventsCollection.doc(eventId)
        this.db.runTransaction(async transaction => {
            const doc = await transaction.get(eventRef)
            const newNumLikes = doc.data().likes + 1
            let newLike_userIDs = doc.data().like_userIDs
            newLike_userIDs.push(this.uid)
            transaction.update(eventRef, {
                likes: newNumLikes,
                like_userIDs: newLike_userIDs
            })

        })
        .catch(error => {
            console.log('like event failed: ', error)
        })

    }


    //an event is unliked, delete from user document
    onUnlikeEvent = async(eventId) => {
        const eventRef = this.eventsCollection.doc(eventId)
        this.db.runTransaction(async transaction => {
            const doc = await transaction.get(eventRef)

            const newNumLikes = doc.data().likes - 1
            let newLike_userIDs = doc.data().like_userIDs.filter(userId => userId !== this.uid)

            transaction.update(eventRef,{
                likes: newNumLikes,
                like_userIDs: newLike_userIDs
            })
        })
        .catch(error => {
            console.log('unlike event failed: ', error)
        })
    }


    updateUserInformation = async(currentData, avatar) => {
        const avatStorageUri = !(avatar === null) ? await this.uploadAvatarAsync(avatar.uri) : null
        const uploadedAvatar = !(avatar === null) ? {
            uri: avatStorageUri
        } : null
        const updateUserdata ={
            ...currentData,
            avatarUri: uploadedAvatar
        }

        await this.usersCollection.doc(this.uid).update(updateUserdata)
        .catch(() => {console.log('rejected')})
        
        return updateUserdata
        
    }

    // group collection query try on liked event
    tryFunction = async(eventId) => {
        console.log(eventId)
        const likedEventUser = this.usersCollection.doc().collection('likedEvents').where('eventId', '==', eventId)
        const like = this.db.collection
        try{
            console.log('this should trigger')
        
            const querySnapshot = await likedEventUser.get()
            console.log(querySnapshot)
            querySnapshot.forEach(doc => {
                if(doc.exists){
                    console.log(doc.data())
                } else{
                    console.log('dont exist')
                }
            })
        } catch(error){
            console.log(error)
        }
    }

    uploadAvatarAsync = async uri => {
        const path = `${'Users'}/${this.uid}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }

    uploadPhotoAsync = async uri => {
        const path = `${'Events'}/${this.uid}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }

    signUpUser = async(email, password) => {

        const firebaseAuth = (
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .catch(error => error.message)
        )
        return firebaseAuth
        
    }

    createUserInFireStore = async (name, email) => {
        const signUpUserInfo ={
            name: name,
            email: email,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            timestamp: Date.now()
        }

        this.usersCollection.doc(this.uid).set(signUpUserInfo)
        .catch((error) => {console.log(error.message)})
    }

    getUserData = async() => {
        let ref = this.usersCollection.doc(this.uid)
        const currentUserData = await ref.get()
        return currentUserData
    }


    //Helpers
    get eventsCollection(){
        return firebase.firestore().collection('Events')
    }

    get usersCollection(){
        return firebase.firestore().collection('Users')
    }

    get db(){
        return firebase.firestore()
    }

    get geoDB(){
        const geoFirestore = new GeoFirestore(this.db)
        return geoFirestore
    }


    get uid(){
        return (firebase.auth().currentUser || {}).uid
    }


}
Firestore = new Fire()

export default Firestore

