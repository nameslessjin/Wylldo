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

        if (snap.data().coords.latitude != null){
            const mapEventData = {
                coords: snap.data().coords,
                tag: snap.data().tag,
                hostAvatar: snap.data().hostAvatar,
                eventId: snap.id,
                likes: snap.data().likes,
                endTime: null
            }
            console.log(mapEventData)
            return db.collection('mapEvents').doc(snap.id).set(mapEventData).catch((error) => {console.log(error.message)})
        }

        return
    })