import firebase from 'react-native-firebase';

export default uploadPhoto = (uri, uploadUri) => {
    return new Promise (async (res, rej) => {

        const ref = firebase.storage().ref(uploadUri);
        const unsubscribe = ref.putFile(uri).on(
            'state_changed',
            state =>  {},
            err => {
                unsubscribe()
                rej(err)
            },
            async () => {
                unsubscribe();
                console.log(ref)
                const storageLocation = ref.fullPath
                console.log(storageLocation)
                const url = await ref.getDownloadURL();
                res({url: url, storageLocation: storageLocation})
            }
        )
    }).catch(error => console.log(error))
}