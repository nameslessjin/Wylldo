// Screen register page

import {Navigation} from 'react-native-navigation'

export function registerScreens(){
    Navigation.registerComponent('Home', () => require('./screens/Home').default)
    Navigation.registerComponent('Initializing', (sc) => require('./screens/Initializing').default)
    Navigation.registerComponent('SignIn', () => require('./screens/Signin').default)
    Navigation.registerComponent('SignUp', () => require('./screens/Signup').default)
    Navigation.registerComponent('Screen2', () => require('./screens/Screen2').default) 
    Navigation.registerComponent('Settings', () => require('./screens/Settings').default)
    Navigation.registerComponent('EventsList', () => require('./screens/EventsList').default)
}