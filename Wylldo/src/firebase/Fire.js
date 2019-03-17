import firebase from 'react-native-firebase'
import uuid from 'uuid'
import uploadPhoto from '../firebase/uploadPhoto'

const collectionName = 'Users'

class Fire {


    //Download Data
    // getPosts = async ({size, start})



    // Upload Data
    addEvent = async(EventInfo,image) => {

        const imgStorageUri = await this.uploadPhotoAsync(image.uri)
        const uploadedImag = {
            ...image,
            uri: imgStorageUri
        }
        const uploadEventInfo = {
            ...EventInfo,
            image: uploadedImag
        }
        console.log(uploadEventInfo)
        this.collection.add(uploadEventInfo)


    }

    uploadPhotoAsync = async uri => {
        const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`
        return uploadPhoto(uri, path)
    }

    addPhoto = async(image) => {

        console.log(image)
        this.uploadPhotoAsync(image.uri)
        
    }

    


    //Helpers
    get collection(){
        return firebase.firestore().collection(collectionName)
    }

    get timestamp(){
        return Data.now()
    }

    get uid(){
        return (firebase.auth().currentUser || {}).uid
    }


}
Firestore = new Fire()

export default Firestore

