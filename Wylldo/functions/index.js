const functions = require('firebase-functions');
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);
var db = admin.firestore()

// exports.onCreateUser = functions.auth.user().onCreate((user) => {

//     // this.usersCollection.doc(this.uid).set(signUpUserInfo)
//     // .catch((error) => {console.log(error.message)})

//     return db.collection('newUser').doc(user.uid).set({name:1})

// })

exports.onEventCreated = functions.firestore
    .document('Events/{eventId}')
    .onCreate((snap, context) => {

        userId = snap.data().hostUserid

        let mapEventCreated = null
        if (snap.data().coords.latitude != null){
            const mapEventData = {
                coords: snap.data().coords,
                tag: snap.data().tag,
                hostAvatar: snap.data().hostAvatar,
                eventId: snap.id,
                likes: snap.data().likes,
                startTime: snap.data().startTime,
                endTime: snap.data().endTime
            }
            mapEventCreated = db.collection('mapEvents').doc(snap.id).set(mapEventData).catch((error) => {console.log(error.message)})
        }

        return mapEventCreated
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
