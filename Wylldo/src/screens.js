// Screen register page
import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'
import {store} from './store/configureStore'

export function registerScreens(){
    Navigation.registerComponentWithRedux('Home', () => require('./screens/Home').default, Provider, store)
    Navigation.registerComponentWithRedux('WylldoList', () => require('./screens/WylldoList').default, Provider, store)
    Navigation.registerComponentWithRedux('AddMap', () => require('./screens/AddMap').default, Provider, store)
    Navigation.registerComponentWithRedux('Settings', () => require('./screens/Settings').default, Provider, store)
    Navigation.registerComponentWithRedux('Profile', () => require('./screens/Profile').default, Provider, store)
    Navigation.registerComponent('Initializing', (sc) => require('./screens/Initializing').default)
    Navigation.registerComponent('LogIn', () => require('./screens/LogIn').default)
    Navigation.registerComponent('SignUp', () => require('./screens/SignUp').default)
    Navigation.registerComponent('AddEvent', () => require('./screens/AddEvent').default)
    Navigation.registerComponent('ShowMap', () => require('./screens/ShowMap').default)
    Navigation.registerComponent('SingleEvent', () => require('./screens/SingleEvent').default)
    Navigation.registerComponent('Auth', () => require('./screens/Auth').default)
}