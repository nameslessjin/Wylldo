import firebase from 'react-native-firebase';

export default uploadPhoto = (uri, uploadUri) => {
    return new Promise (async (res, rej) => {
        const response = await fetch(uri);
        const blob = await response.blob()

        const ref = firebase.storage().ref(uploadUri);
        const unsubscribe = ref.putFile(blob).on(
            'state_changed',
            state =>  {},
            err => {
                unsubscribe()
                rej(err)
            },
            async () => {
                unsubscribe();
                const url = await ref.getDownloadURL();
                res(url)
            }
        )
    })
}