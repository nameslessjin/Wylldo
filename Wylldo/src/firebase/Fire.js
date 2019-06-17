import firebase from 'react-native-firebase'
import uuid from 'uuid'
import uploadPhoto from '../firebase/uploadPhoto'
import {GeoFirestore} from 'geofirestore'
import geohash from 'ngeohash'

class Fire {
    constructor(){
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
                const hostAvatarUri =  await this.getAvatarUri(event.hostAvatar)
                const eventWithKey = {
                    key: querySnapshot.id,
                    eventId: querySnapshot.id,
                    ...event,
                    hostAvatar: {
                        uri: hostAvatarUri
                    }
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

    getUsers = async({size, start, userIdList, type}) => {
        let userList = []
        let startPosition = 0
        if (start){
            startPosition = start
        }

        while (userList.length <= size && startPosition < userIdList.length){
            let docRef = this.usersCollection.doc(userIdList[startPosition])
            const querySnapshot = await docRef.get()
            if (querySnapshot.exists){
                const user = querySnapshot.data() || {}
                const userWithKey = {
                    key: querySnapshot.id,
                    userId: querySnapshot.id,
                    ...user
                }
                userList.push(userWithKey)
            }
            startPosition = startPosition + 1
        }
        if (startPosition == userIdList.length){
            startPosition = null
        }
        return {userList, start: startPosition}
    }

    getEventsWithId = async(eventId) => {
        let ref = this.eventsCollection.doc(eventId)
        let eventWithKey = {}
        const querySnapshot = await ref.get();
        if (querySnapshot.exists){
            const event = querySnapshot.data() || {}
            const hostAvatarUri = await this.getAvatarUri(event.hostAvatar)
            eventWithKey = {
                key: querySnapshot.id,
                eventId: querySnapshot.id,
                ...event,
                hostAvatar:{
                    uri: hostAvatarUri
                }
            }
        }
        return eventWithKey
        
    }

    addComments = async({event_id, username, display_name, comment, user_avatar, user_id}) => {
        let ref = this.db.collection('comment')
        let uploadComment = {
            event_id: event_id,
            username: username,
            user_id: user_id,
            user_avatar: user_avatar,
            comment: comment,
            display_name: display_name,
            create_time: firebase.firestore.FieldValue.serverTimestamp()
        }

        const createComment = await ref.add(uploadComment).catch(error => console.log(error))
    }

    getComments = async ({eventId, start}) => {
        const size = 7
        let ref = this.db.collection('comment').where('event_id', '==', eventId).orderBy('create_time', 'ASC').limit(size)

        try{
            if(start){
                ref = ref.startAfter(start)
            }
            let comments = []
            const querySnapshot = await ref.get().catch(error => console.log(error))
            for (const doc of querySnapshot.docs){
                if (doc.exists){
                    const comment = doc.data() || {}
                    const user_avatar = await this.getAvatarUri(comment.user_avatar)
                    const commentWithKey = {
                        key: doc.id,
                        commentId: doc.id,
                        ...comment,
                        user_avatar: {
                            uri: user_avatar
                        }
                    }
                    comments.push(commentWithKey)
                }
            }

            const startPosition = querySnapshot.docs[querySnapshot.docs.length - 1]
            return {comments: comments, cursor: startPosition}
        } catch(error) {
            console.log('Get Comment error')
        }
    }
    
    getProfileEvents = async({size, start, type, userId}) => {
        let ref = null
        if(type == 'Created'){
            ref = this.eventsCollection.where('hostUserId', '==', userId).orderBy('timestamp', 'DESC').limit(size)
        } else if (type == 'Liked'){
            ref = this.eventsCollection.where('like_userIDs', 'array-contains', userId).orderBy('timestamp', 'DESC').limit(size)
        } else if (type == 'Joined'){
            ref = this.eventsCollection.where('join_userIDs', 'array-contains', userId).orderBy('startTime', 'DESC').limit(size)
        }
        try{
            if(start) {
                ref = ref.startAfter(start)
            }
            let eventData = []
            const querySnapshot = await ref.get().catch(error => console.log(error))
            for (const doc of querySnapshot.docs){
                if (doc.exists){
                    const event = doc.data() || {}
                    const hostAvatar = await this.getAvatarUri(event.hostAvatar)
                    const eventWithKey = {
                        key: doc.id,
                        eventId: doc.id,
                        ...event,
                        hostAvatar:{
                            uri: hostAvatar
                        }
                    }
                    eventData.push(eventWithKey)
                }
            }
            const startPosition = querySnapshot.docs[querySnapshot.docs.length - 1]
            return {eventData: eventData, cursor: startPosition}
        } catch ({error}) {
            console.log('getCreatedEvennts error:', error)
        }
    }

    //used to get location and tag for the map.
    getMapEvents = async() => {
        const mapRef = this.geoDB.collection('mapEvents')
        const geoQuery = mapRef.near({center: new firebase.firestore.GeoPoint(40.798699, -77.859954), radius: 8.5})
        const querySnapshot = await geoQuery.get()
        let mapEventData = []
        for (const doc of querySnapshot.docs){
            if (doc.exists){
                const mapEvent = doc.data() || {}
                const hostAvatarUri = await this.getAvatarUri(mapEvent.hostAvatar)
                const mapEventsWithKey = {
                    key: doc.id,
                    ...mapEvent,
                    eventId: doc.id,
                    hostAvatar:{
                        uri: hostAvatarUri
                    }
                }
                mapEventData.push(mapEventsWithKey)
            }
        }
        console.log(this.mapEventData)
        return mapEventData
    }

    // Upload Data
    addEvent = async(EventInfo, image, resizedImage) => {
        const imgStorageUri = !(image === null) ? await this.uploadImageAsync(image.uri) : null
        const uploadedImag =  !(image === null) ? {
            ...image,
            uri: imgStorageUri.url
        } : null

        const resImgStorageUri = !(resizedImage === null) ? await this.uploadresizedImageAsync(resizedImage.uri) : null
        const uploadedResImag = !(resizedImage === null) ? {
            uri : resImgStorageUri.url,
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
        const hostAvatarUri = await this.getAvatarUri(uploadEventInfo.hostAvatar)
        const updateEventInfo = [{
            ...uploadEventInfo,
            key: createdEvent.id,
            eventId: createdEvent.id,
            hostAvatar:{
                uri: hostAvatarUri
            }

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
                this.joinNum = newJoinedNum
                this.joinUserIds = newJoin_userIDs
            } else {
                this.joinNum = doc.data().inviteCount
                this.joinUserIds = doc.data().join_userIDs
            }
        })
        .catch(error => {
            this.joinNum = 0
            this.joinUserIds = []
        })

        const joinNum = this.joinNum
        const joinUserIds = this.joinUserIds
        return {joinNum: joinNum, joinUserIds: joinUserIds}
    }

    onFollowUser = async (followingUserId) => {
        const currentUserRef = this.usersCollection.doc(this.uid)
        const followingUserRef = this.usersCollection.doc(followingUserId)
        await this.db.runTransaction(async transaction => {
            const currentUserDoc = await transaction.get(currentUserRef)
            const followingUserDoc = await transaction.get(followingUserRef)
            let newFollowing_list = currentUserDoc.data().following_list.filter(userId => userId !== followingUserId)
            newFollowing_list.push(followingUserId)
            let newFollower_list = followingUserDoc.data().follower_list.filter(userId => userId != this.uid)
            newFollower_list.push(this.uid)
            transaction.update(currentUserRef, {
                followingNum: newFollowing_list.length,
                following_list: newFollowing_list
            })
            transaction.update(followingUserRef, {
                followerNum: newFollower_list.length,
                follower_list: newFollower_list
            })
        }).catch(error => console.log(error))

        return true

    }

    onUnfollowUser = async(followingUserId) => {

        const currentUserRef = this.usersCollection.doc(this.uid)
        const followingUserRef = this.usersCollection.doc(followingUserId)
        await this.db.runTransaction(async transaction => {
            const currentUserDoc = await transaction.get(currentUserRef)
            const followingUserDoc = await transaction.get(followingUserRef)
            let newFollowing_list = currentUserDoc.data().following_list.filter(userId => userId !== followingUserId)
            let newFollower_list = followingUserDoc.data().follower_list.filter(userId => userId != this.uid)
            transaction.update(currentUserRef, {
                followingNum: newFollowing_list.length,
                following_list: newFollowing_list
            })
            transaction.update(followingUserRef, {
                followerNum: newFollower_list.length,
                follower_list: newFollower_list
            })
        }).catch(error => console.log(error))

        return true
    }

    checkFollow = async(followingUserId) => {
        const followRef = this.db.collection('Follow').where('followerUserId', '==', this.uid).where('followingUserId', '==', followingUserId)
        const querySnapshot = await followRef.get().catch(error => console.log(error))
        const follow = []
        querySnapshot.forEach(doc => {
            if (doc.exists){
                const followData = doc.data() || {}
                const followDataWithKey = {
                    ...followData,
                    key: doc.id,
                    followId: doc.id
                }
                follow.push(followDataWithKey)
            }
        })
        return follow[0]
    }

    onCancelEvent = async(eventId) => {
        const eventRef = this.eventsCollection.doc(eventId)
        await this.db.runTransaction(async transaction => {
            const doc = await transaction.get(eventRef)
            let newJoin_userIDs = doc.data().join_userIDs.filter(userId => userId !== this.uid)
            const newJoinedNum = newJoin_userIDs.length + 1
            transaction.update(eventRef, {
                joinedNum: newJoinedNum,
                join_userIDs: newJoin_userIDs
            })
            this.joinNum = newJoinedNum
            this.joinUserIds = newJoin_userIDs
        })
        .catch(error => {
            this.joinNum = 0
            this.joinUserIds = []
        })
        
        const joinNum = this.joinNum
        const joinUserIds = this.joinUserIds
        return {joinNum: joinNum, joinUserIds: joinUserIds}

    }


    updateUserInformation = async(currentData, avatar) => {
        const avatStorageUri = !(avatar === null) ? await this.uploadAvatarAsync(avatar.uri) : null
        const uploadedAvatar = !(avatar === null) ? {
            uri: avatStorageUri.url,
            storageLocation: avatStorageUri.storageLocation
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
        const path = `${'Users'}/${this.uid}/${'Profile_Pic'}/${'avatar'}.jpg`
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

        const defaultAvatarUri = 'https://firebasestorage.googleapis.com/v0/b/wylldo-b5c47.appspot.com/o/defaultImgs%2FdefaultAvatar.jpg?alt=media&token=4a49bd80-9d7a-4293-a719-de0211cb4a96'
        const defaultAvatarLocation = 'defaultImgs/defaultAvatar.jpg'
        const uploadedAvatar = {
            uri: defaultAvatarUri,
            storageLocation: defaultAvatarLocation
        }
        const signUpUserInfo ={
            avatarUri: uploadedAvatar,
            name: name,
            display_name: name,
            username: name,
            email: email,
            createdTime: firebase.firestore.FieldValue.serverTimestamp(),
            timestamp: Date.now(),
            followerNum: 0,
            followingNum: 0,
            following_list: [],
            follower_list: []
        }

        this.usersCollection.doc(this.uid).set(signUpUserInfo)
        .catch((error) => {console.log(error.message)})
    }

    getUserData = async(userId) => {
        const ref = this.usersCollection.doc(userId)
        const userData = await ref.get().catch(error => console.log(error))
        const returnUserData = {
            ...userData.data(),
            userId: userData.id
        }

        return returnUserData
    }


    //Helpers

    getAvatarUri = async (storageLocation) => {
        const avatarUri = await firebase.storage().ref(storageLocation).getDownloadURL()
        return avatarUri
    }

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

