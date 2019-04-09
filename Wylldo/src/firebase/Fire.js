import firebase from 'react-native-firebase'
import uuid from 'uuid'
import uploadPhoto from '../firebase/uploadPhoto'

const collectionName = 'Events'

class Fire {

    constructor(){
        firebase.auth().onAuthStateChanged(user => {
        })
    }


    //Download Data
    // get data here
    getEvents = async (size) => {
        let ref = this.collection.orderBy('createdTime', 'desc').limit(size);
        // try{
        //     if(start){
        //         ref = ref.startAfter(start)
        //     }
        // }
            const querySnapshot = await ref.get();
            const eventData = []
            querySnapshot.forEach(doc => {
                if (doc.exists){
                    eventData.push(doc._data)
                }
            })
            // console.log(eventData)
            console.log(querySnapshot)
            return eventData
            // querySnapshot.forEach(doc => {
            //     if (doc.exists){
            //         console.log(doc)

            //         // const post = doc.data() || {};

            //         // const user = post.user || {}
            //         // const reduced = {
            //         //     key: doc.key
            //         // }

            //     }
            // })
    }


    // Upload Data
    addEvent = async(EventInfo,image) => {
   
        const imgStorageUri = !(image === null) ? await this.uploadPhotoAsync(image.uri) : null
        const uploadedImag =  !(image === null) ? {
            ...image,
            uri: imgStorageUri
        } : null
        const uploadEventInfo = {
            ...EventInfo,
            image: uploadedImag
        }
        this.collection.add(uploadEventInfo).catch( () => {console.log('rejected')})

        return uploadEventInfo
    }

    uploadPhotoAsync = async uri => {
        const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }


    //Helpers
    get collection(){
        return firebase.firestore().collection(collectionName)
    }

    // get timestamp(){
    //     return Data.now()
    // }

    get uid(){
        return (firebase.auth().currentUser || {}).uid
    }


}
Firestore = new Fire()

export default Firestore

