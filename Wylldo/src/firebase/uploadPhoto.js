import firebase from 'react-native-firebase';

const uploadPhoto = (uri, uploadUri) => {
    return new Promise (async (res, rej) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref(uploadUri)
    })
}