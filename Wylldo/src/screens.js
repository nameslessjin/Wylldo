// Screen register page
import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'
import {store} from './store/configureStore'

export function registerScreens(){
    Navigation.registerComponentWithRedux('Home', () => require('./screens/Home').default, Provider, store)
    Navigation.registerComponent('Initializing', (sc) => require('./screens/Initializing').default)
    Navigation.registerComponent('SignIn', () => require('./screens/Signin').default)
    Navigation.registerComponent('SignUp', () => require('./screens/Signup').default)
    Navigation.registerComponent('Settings', () => require('./screens/Settings').default)
    Navigation.registerComponentWithRedux('WylldoList', () => require('./screens/WylldoList').default, Provider, store)
    Navigation.registerComponent('AddEvent', () => require('./screens/AddEvent').default)
    Navigation.registerComponent('ShowMap', () => require('./screens/ShowMap').default)
    Navigation.registerComponentWithRedux('AddMap', () => require('./screens/AddMap').default, Provider, store)
    Navigation.registerComponent('SingleEvent', () => require('./screens/SingleEvent').default)
}