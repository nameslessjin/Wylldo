import firebase from 'react-native-firebase'


class Fire {


    //Download Data
    // getPosts = async ({size, start})



    // Upload Data
    addEvent = async(EventInfo) => {
        console.log(EventInfo)
        this.collection.add(EventInfo)
        .catch({message})(
            console.log(message)
        )
    }

    uploadPhoto = async uri => {

    }

    


    //Helpers
    get collection(){
        return firebase.firestore().collection('Users')
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

