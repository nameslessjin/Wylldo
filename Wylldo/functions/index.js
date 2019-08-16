const functions = require('firebase-functions');
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
const nodemailer = require('nodemailer')

admin.initializeApp(functions.config().firebase);
var db = admin.firestore()


let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'wylldo.app@gmail.com',
        pass: 'FFversus13'
    }
})


exports.onReport = functions.firestore
    .document('report/{report_id}')
    .onCreate((snap, context) => {
        
        const {event_id, comment_id, reporter_email, reporter_username} = snap.data()

        const emailOption = {
            from: 'wylldo.app@gmail.com',
            to: 'wylldo.feedback@gmail.com',
            subject: 'Report',
            html: ('<p>' + 'event_id: ' + event_id + '<br>' + 
                    'comment_id: ' + comment_id + '<br>'
                     + 'reporter_email: ' + reporter_email + '<br>'  +
                     'reporter_username: ' + reporter_username +
                    '</p>')
        }

        return transporter.sendMail(emailOption, (error, info) => {
            if (error){
                console.log(error)
            }
            return info
        })
    })

// exports.onInteractiveBtnPressedMapEventUpdate = functions.firestore
// .document('Events/{eventId}')
// .onUpdate((snap, context) => {
//     const mapEventRef = db.collection('mapEvents').doc(context.params.eventId)
//     return db.runTransaction(transaction => {
//         return transaction.get(mapEventRef).then(eventDoc => {
//             const mapEventData = eventDoc.data().d
//             const newLikesNum = snap.after.data().likes
//             const newJoinedNum = snap.after.data().joinedNum

//             return transaction.update(mapEventRef, {
//                 d:{
//                     ...mapEventData,
//                     likes: newLikesNum,
//                     joinedNum: newJoinedNum
//                 }
//             })
//         })
//     })

// })

exports.onUpdateUser = functions.firestore
    .document('Users/{userId}')
    .onUpdate((snap, context) => {
        
        const new_follower_list = snap.after.data().follower_list
        const old_follower_list = snap.before.data().follower_list
        const new_follower_num = snap.after.data().followerNum
        const old_follower_num = snap.before.data().followerNum
        const new_following_list = snap.after.data().following_list
        const old_following_list = snap.before.data().following_list
        const new_following_num = snap.after.data().followingNum
        const old_following_num = snap.before.data().followerNum
        const fcm_token = snap.after.data().fcm_token

        if (old_follower_num < new_follower_num){
            const receiver_id = context.params.userId
            const sender_id = new_follower_list.filter(user_id => !(old_follower_list.includes(user_id)))[0]
            if (sender_id){
                return db.collection('Users').doc(sender_id).get().then(res => {
                    const sender_name = res.data().username
                    let payload = {
                        notification: {
                            title: 'Followed',
                            body: sender_name + ' just followed you!',
                            sound: 'default'
                        }
                    }
                    admin.messaging().sendToTopic('pushNotifications', payload)
                    return admin.messaging().sendToDevice(fcm_token, payload)
                })
            }
        }



    })

exports.onUpdateEvent = functions.firestore
    .document('Events/{eventId}')
    .onUpdate((snap, context) => {
        const host_name = snap.after.data().hostUsername
        const old_joinedNum = snap.before.data().joinedNum
        const new_joinedNum = snap.after.data().joinedNum
        const old_join_userIDs = snap.before.data().join_userIDs
        const new_join_userIDs = snap.after.data().join_userIDs
        const old_likes = snap.before.data().likes
        const new_likes = snap.after.data().likes
        const new_like_userIDs = snap.after.data().like_userIDs
        const old_isCompleted = snap.before.data().isCompleted
        const new_isCompleted = snap.after.data().isCompleted

        if (!old_isCompleted && new_isCompleted){
            const mapEventRef = db.collection('mapEvents').doc(context.params.eventId)
            mapEventRef.update({
                d:{
                    isCompleted: true
                }
            })
        }

        //update mapEvents when event changes
        const mapEventRef = db.collection('mapEvents').doc(context.params.eventId)
        db.runTransaction(transaction => {
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

        //send notification to user when the user is removed
        if (old_joinedNum > new_joinedNum){
            const senderId = snap.after.data().hostUserId
            const receiverId = old_join_userIDs.filter(user_id => !(new_join_userIDs.includes(user_id)))[0]
            if (receiverId){
                return db.collection('Users').doc(receiverId).get().then(res => {
                    const receiverFCMToken = res.data().fcm_token
                    let payload = {
                        notification: {
                            title: 'Removed',
                            body: host_name + ' has removed you from joinee list.',
                            sound: 'default'
                        }
                    }
                    admin.messaging().sendToTopic('pushNotifications', payload)
                    return admin.messaging().sendToDevice(receiverFCMToken, payload)
                })
            }
        }

        // send notification to the host when new user join
        if (old_joinedNum < new_joinedNum){
            const receiverId = snap.after.data().hostUserId
            const senderId = [...new_join_userIDs][new_join_userIDs.length-1]
            if (senderId){
                return db.collection('Users').doc(receiverId).get().then(res => {
                    const receiverFCMToken = res.data().fcm_token
                    return db.collection('Users').doc(senderId).get().then(res => {
                        const sender_username = res.data().username
                        let payload = {
                            notification:{
                                title: 'Joined',
                                body: sender_username + ' has just joined you.  Check out who in your list.',
                                sound: 'default'
                            }
                        }
                        admin.messaging().sendToTopic("pushNotifications", payload)
                        return admin.messaging().sendToDevice(receiverFCMToken, payload)
                    })
                })
            }
        }

        // send notification to the host when post is liked
        if (old_likes < new_likes){
            const receiverId = snap.after.data().hostUserId
            const senderId = [...new_like_userIDs][new_like_userIDs.length-1]
            if (senderId){
                if (receiverId != senderId){
                    return db.collection('Users').doc(receiverId).get().then(res => {
                        const receiverFCMToken = res.data().fcm_token
                        return db.collection('Users').doc(senderId).get().then(res => {
                            const sender_username = res.data().username
                            let payload = {
                                notification:{
                                    title: 'Liked',
                                    body: sender_username + ' just liked your post.  Check it out',
                                    sound: 'default'
                                }
                            }
                            admin.messaging().sendToTopic("pushNotifications", payload)
                            return admin.messaging().sendToDevice(receiverFCMToken, payload)
                        })
                    })
                }
            }
        }
    })


exports.onAddComment = functions.firestore
    .document('comment/{commentId}')
    .onCreate((snap, context) => {

        const event_id = snap.data().event_id
        const username = snap.data().username
        const comment = snap.data().comment
        const user_id = snap.data().user_id
        const receiverId = snap.data().host_user_id
        const eventRef = db.collection('Events').doc(event_id)

        if (user_id != receiverId){
            db.collection('Users').doc(receiverId).get().then(res => {
                const receiverFCMToken = res.data().fcm_token
                let payload = {
                    notification:{
                        title: 'Comment',
                        body: username + ' just commented your post.  Check it out',
                        sound: 'default'
                    }
                }
                admin.messaging().sendToTopic("pushNotifications", payload)
                admin.messaging().sendToDevice(receiverFCMToken, payload)
            })
        }

        return db.runTransaction(transaction => {
            return transaction.get(eventRef).then(eventDoc => {
                const comment_num = eventDoc.data().commentNum + 1
                let sample_comment = [...eventDoc.data().sample_comment]
                const sample = {
                    username: username,
                    comment: comment,
                    user_id: user_id
                }
                if (sample_comment.length < 2){
                    sample_comment.push(sample)
                }
                
                return transaction.update(eventRef,{
                    ...eventDoc.data(),
                    commentNum: comment_num,
                    sample_comment: sample_comment
                })

                
            })
        })
    })

exports.onDeleteComment = functions.firestore
    .document('comment/{commentId}')
    .onDelete((snap, context) => {
        const event_id = snap.data().event_id
        const comment = snap.data().comment
        const user_id = snap.data().user_id
        const eventRef = db.collection('Events').doc(event_id)
        return db.runTransaction(transaction => {
            return transaction.get(eventRef).then(eventDoc => {
                const comment_num = eventDoc.data().commentNum - 1
                let sample_comment = [...eventDoc.data().sample_comment]
                sample_comment = sample_comment.filter(sample => {
                    if (sample.user_id == user_id && sample.comment == comment){
                        return false
                    }
                    return true
                })

                return transaction.update(eventRef, {
                    ...eventDoc.data(),
                    commentNum: comment_num,
                    sample_comment: sample_comment
                })

            })
        })


    })

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
                    inviteCount: snap.data().inviteCount,
                    viewType: snap.data().viewType,
                    isCompleted: snap.data().isCompleted
                },
                g: snap.data().geoHash,
                l: snap.data().geoCoordinates

            }
            mapEventCreated = db.collection('mapEvents').doc(snap.id).set(mapEventData).catch((error) => {console.log(error.message)})
        }
        
        return mapEventCreated
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
