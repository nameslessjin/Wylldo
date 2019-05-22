import firebase from 'react-native-firebase'
import uuid from 'uuid'
import uploadPhoto from '../firebase/uploadPhoto'
import {AsyncStorage} from 'react-native'


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
            joinedNum: 1
            
        }

        const createdEvent = await this.eventsCollection.add(uploadEventInfo).catch( () => {console.log('rejected')})
        
        const updateEventInfo = [{
            ...uploadEventInfo,
            key: createdEvent.id,
            eventId: createdEvent.id
        }]

        return updateEventInfo
    }

    //an event is liked, add to user document
    createLikedEvent = async(eventInfo) => {
        this.usersCollection.doc(this.uid).collection('likedEvents').doc(eventInfo.eventId).set(eventInfo)
        .catch((error) => {console.log(error)})
    }

    //an event is unliked, delete from user document
    deleteLikedEvent = async(eventId) => {
        this.usersCollection.doc(this.uid).collection('likedEvents').doc(eventId).delete()
        .catch(error => {console.log(error)})
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


    get uid(){
        return (firebase.auth().currentUser || {}).uid
    }


}
Firestore = new Fire()

export default Firestore

