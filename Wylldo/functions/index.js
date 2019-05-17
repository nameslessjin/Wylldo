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
        const createdEvent = {
            ...snap.data(),
            eventId: snap.id
        }
        userEventCreated = db.collection('Users').doc(userId).collection('CreatedEvents').doc(snap.id).set(createdEvent).catch((error) => {console.log(error.message)})

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

        return {userEventCreated, mapEventCreated}
    })