const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase);
var db = admin.firestore()


exports.onEventCreated = functions.firestore
    .document('Events/{eventId}')
    .onCreate((snap, context) => {

        let mapEventCreated = null
        if (snap.data().coords.latitude != null){
            const mapEventData = {
                d:{
                    tag: snap.data().tag,
                    hostAvatar: snap.data().hostAvatar,
                    eventId: snap.id,
                    likes: snap.data().likes,
                    startTime: snap.data().startTime,
                    endTime: snap.data().endTime,
                    coords: snap.data().geoCoordinates,
                    createdTime: snap.data().timestamp,
                    joinedNum: snap.data().joinedNum,
                    inviteCount: snap.data().inviteCount
                },
                g: snap.data().geoHash,
                l: snap.data().geoCoordinates

            }
            mapEventCreated = db.collection('mapEvents').doc(snap.id).set(mapEventData).catch((error) => {console.log(error.message)})
        }

        return mapEventCreated
    })

exports.onInteractiveBtnPressed = functions.firestore
    .document('Events/{eventId}')
    .onUpdate((snap, context) => {
        const mapEventRef = db.collection('mapEvents').doc(context.params.eventId)
        return db.runTransaction(transaction => {
            return transaction.get(mapEventRef).then(eventDoc => {
                const mapEventData = eventDoc.data().d
                const newLikesNum = snap.after.data().likes
                const newJoinedNum = snap.after.data().joinedNum

                return transaction.update(mapEventRef, {
                    d:{
                        ...mapEventData,
                        likes: newLikesNum,
                        joinedNum: newJoinedNum
                    }
                })
            })
        })

    })

exports.onEventDeleted = functions.firestore
    .document('Events/{eventId}')
    .onDelete((snap, context) => {

        const mapEventRef = db.collection('mapEvents').doc(context.params.eventId)
        const deletetMapEvent = mapEventRef.delete().catch(error => {console.log(error)})

        return deletetMapEvent
    })

exports.checkExpiredMapEvents = functions.pubsub.schedule('every 5 minutes').onRun((context) => {

    const currentTime = new Date()
    const query = db.collection('mapEvents').where('d.endTime', '<=', currentTime)
    const deleteExpiredEvents = query.get()
                                    .then((snapshot) => {
                                        const batch = db.batch()
                                        snapshot.docs.forEach(doc => {
                                            batch.delete(doc.ref)
                                        })
                                        return batch.commit()
                                    })
                                    .catch(error => console.log(error))

    return deleteExpiredEvents

})

// exports.onLikedCreated = functions.firestore
//     .document('Users/{userId}/likedEvents/{eventId}')
//     .onCreate((snap, context) => {
//         const eventRef = db.collection('Events').doc(context.params.eventId)
//         return db.runTransaction(transaction => {
//             return transaction.get(eventRef).then(eventDoc => {
//                 const newLikesNum = eventDoc.data().likes + 1
//                 let newLike_userIDs = eventDoc.data().like_userIDs
//                 newLike_userIDs.push(context.params.userId)

//                 return transaction.update(eventRef, {
//                     likes: newLikesNum,
//                     like_userIDs: newLike_userIDs
//                 })
//             })
//         })

//     })

// exports.onLikedDeleted = functions.firestore
//     .document('Users/{userId}/likedEvents/{eventId}')
//     .onDelete((snap, context) => {
//         const eventRef = db.collection('Events').doc(context.params.eventId)
        

//         return db.runTransaction(transaction => {
//             return transaction.get(eventRef).then(eventDoc => {
//                 const newLikesNum = eventDoc.data().likes - 1
//                 let newLike_userIDs = eventDoc.data().like_userIDs.filter(item => item !== context.params.userId )

//                 return transaction.update(eventRef, {
//                     likes: newLikesNum,
//                     like_userIDs: newLike_userIDs
//                 })
//             })
//         })

//     })
