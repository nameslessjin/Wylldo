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
        this.mapEventData = []
        this.joinResult = null
    }

    //Download Data
    // get data here for wylldoList
    getEvents = async ({size, start, eventIdList}) => {
        let eventData = []
        let startPosition = 0
        if (start){
            startPosition = start
        }

        while (eventData.length != size && startPosition < eventIdList.length){
            let docRef = this.eventsCollection.doc(eventIdList[startPosition][1])
            const querySnapshot = await docRef.get()
            if (querySnapshot.exists){
                const event = querySnapshot.data() || {}
                const eventWithKey = {
                    key: querySnapshot.id,
                    eventId: querySnapshot.id,
                    ...event
                }
                eventData.push(eventWithKey)
            }
            startPosition = startPosition + 1
        }

        if (startPosition == eventIdList.length){
            startPosition = null
        }

        return {eventData, cursor: startPosition}

    }

    getEventsWithId = async(eventId) => {
        let ref = this.eventsCollection.doc(eventId)
        const querySnapshot = await ref.get();
        return querySnapshot.data()
        
    }
    
    getProfileEvents = async({size, start, type}) => {
        let ref = null
        if(type == 'Created'){
            ref = this.eventsCollection.where('hostUserId', '==', this.uid).orderBy('timestamp', 'DESC').limit(size)
        } else if (type == 'Liked'){
            ref = this.eventsCollection.where('like_userIDs', 'array-contains', this.uid).orderBy('timestamp', 'DESC').limit(size)
        } else if (type == 'Joined'){
            ref = this.eventsCollection.where('join_userIDs', 'array-contains', this.uid).orderBy('timestamp', 'DESC').limit(size)
        }

        try{
            if(start) {
                ref = ref.startAfter(start)
            }
            const querySnapshot = await ref.get().catch(error => console.log(error))
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
            const startPosition = querySnapshot.docs[querySnapshot.docs.length - 1]
            return {eventData: eventData, cursor: startPosition}
        } catch ({error}) {
            console.log('getCreatedEvennts error')
        }
    }

    //used to get location and tag for the map.
    getMapEvents = async() => {
        const mapRef = this.geoDB.collection('mapEvents')
        const geoQuery = mapRef.near({center: new firebase.firestore.GeoPoint(40.798699, -77.859954), radius: 8.5})
        const mapEventsDataTry = await geoQuery.get().then(geoQuerySnapshot => {
            geoQuerySnapshot.forEach(doc => {
                    const mapEventsData = []
                    if (doc.exists){
                        const mapEvent = doc.data() || {}
                        const mapEventsWithKey = {
                            key: doc.id,
                            ...mapEvent,
                            eventId: doc.id
                        }
                        this.mapEventData.push(mapEventsWithKey)
                    }
            })
        })
        const mapEventData = this.mapEventData
        this.mapEventData = []
        return mapEventData
    }

    // Upload Data
    addEvent = async(EventInfo, image, resizedImage) => {
        const imgStorageUri = !(image === null) ? await this.uploadImageAsync(image.uri) : null
        const uploadedImag =  !(image === null) ? {
            ...image,
            uri: imgStorageUri
        } : null

        const resImgStorageUri = !(resizedImage === null) ? await this.uploadresizedImageAsync(resizedImage.uri) : null
        const uploadedResImag = !(resizedImage === null) ? {
            uri : resImgStorageUri,
        } : null


        const uploadEventInfo = {
            ...EventInfo,
            resizedImage: uploadedResImag,
            image: uploadedImag,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            like_userIDs: [],
            joinedNum: 1,
            join_userIDs: [],
            geoCoordinates: (EventInfo.coords.latitude) ? new firebase.firestore.GeoPoint(EventInfo.coords.latitude, EventInfo.coords.longitude) : null,
            geoHash: (EventInfo.coords.latitude) ? geohash.encode(EventInfo.coords.latitude, EventInfo.coords.longitude, precision=10) : null
        }

        const createdEvent = await this.eventsCollection.add(uploadEventInfo).catch(error => console.log(error))
        

        const updateEventInfo = [{
            ...uploadEventInfo,
            key: createdEvent.id,
            eventId: createdEvent.id
        }]

        return updateEventInfo
    }

    //an event is liked, add to user document
    onLikeEvent = async(eventId) => {
        const eventRef = this.eventsCollection.doc(eventId)
        this.db.runTransaction(async transaction => {
            const doc = await transaction.get(eventRef)
            let newLike_userIDs = doc.data().like_userIDs
            newLike_userIDs.push(this.uid)
            const newNumLikes = newLike_userIDs.length
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

            let newLike_userIDs = doc.data().like_userIDs.filter(userId => userId !== this.uid)
            const newNumLikes = newLike_userIDs.length
            transaction.update(eventRef,{
                likes: newNumLikes,
                like_userIDs: newLike_userIDs
            })
        })
        .catch(error => {
            console.log('unlike event failed: ', error)
        })
    }

    onJoinEvent = async(eventId) => {
        const eventRef = this.eventsCollection.doc(eventId)
        await this.db.runTransaction(async transaction => {
            const doc = await transaction.get(eventRef)
            let newJoin_userIDs = doc.data().join_userIDs.filter(userId => userId !== this.uid)
            newJoin_userIDs.push(this.uid)
            const newJoinedNum = newJoin_userIDs.length + 1
            if (newJoinedNum <= doc.data().inviteCount){
                transaction.update(eventRef, {
                    joinedNum: newJoinedNum,
                    join_userIDs: newJoin_userIDs
                })
                this.joinResult = newJoinedNum
            } else {
                this.joinResult = doc.data().inviteCount
            }
        })

        const joinResult = this.joinResult
        return joinResult
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

    //Delete an event
    deleteEvent = async (eventId) => {
        const ref = this.eventsCollection.doc(eventId)
        const deleteEvent = await ref.delete().catch(error => {console.log(error)})
        return eventId
    }

    uploadAvatarAsync = async uri => {
        const path = `${'Users'}/${this.uid}/${'Profile_Pic'}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }

    uploadImageAsync = async uri => {
        const path = `${'Events'}/${this.uid}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }

    uploadresizedImageAsync = async uri => {
        const path = `${'Events'}/${this.uid}/${'resizedImage'}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path).catch(error => console.log(error))
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
        const ref = this.usersCollection.doc(this.uid)
        const currentUserData = await ref.get().catch(error => console.log(error))
        return currentUserData.data()
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

