import {Navigation} from 'react-native-navigation'

export const goHome = () => Navigation.setRoot({
    root: {
        stack:{
            id: 'App',
            children:[
                {
                    component:{
                        name: 'Home'
                    }
                }
            ]
        }
    }
})


export const goToAuth = () => Navigation.setRoot({
    root:{
        stack:{
            id: 'Auth',
            children:[
                {
                    component:{
                        name: 'SignIn'
                    }
                },
                {
                    component:{
                        name: 'SignUp'
                    }
                }
            ]
        }

    }
})