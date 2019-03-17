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
                const url = await ref.getDownloadURL();
                console.log(url)
                res(url)
            }
        )
    })
}