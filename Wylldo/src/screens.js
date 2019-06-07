// Screen register page
import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'
import {store} from './store/configureStore'


// "Home, WylldoList, AddMap, Settings and Profile page are connected with redux to help manage and store data locally through store from configureStore"
export function registerScreens(){
    Navigation.registerComponentWithRedux('Home', () => require('./screens/Home').default, Provider, store)
    Navigation.registerComponentWithRedux('WylldoList', () => require('./screens/WylldoList').default, Provider, store)
    Navigation.registerComponentWithRedux('AddMap', () => require('./screens/AddMap').default, Provider, store)
    Navigation.registerComponentWithRedux('Settings', () => require('./screens/Settings').default, Provider, store)
    Navigation.registerComponentWithRedux('Profile', () => require('./screens/Profile').default, Provider, store)
    Navigation.registerComponentWithRedux('followerSelect', () => require('./screens/followerSelect').default, Provider, store)
    Navigation.registerComponentWithRedux('SingleEvent', () => require('./screens/SingleEvent').default, Provider, store)
    Navigation.registerComponentWithRedux('JoinedUserList', () => require('./screens/JoinedUserList').default, Provider, store)
    Navigation.registerComponent('Initializing', (sc) => require('./screens/Initializing').default)
    Navigation.registerComponent('LogIn', () => require('./screens/LogIn').default)
    Navigation.registerComponent('SignUp', () => require('./screens/SignUp').default)
    Navigation.registerComponent('AddEvent', () => require('./screens/AddEvent').default)
    Navigation.registerComponent('ShowMap', () => require('./screens/ShowMap').default)
    Navigation.registerComponent('Auth', () => require('./screens/Auth').default)
    Navigation.registerComponent('OtherProfile', () => require('./screens/OtherProfile').default)


    //this is not a screen
    Navigation.registerComponentWithRedux('EventOption', () => require('./Components/EventOption').default, Provider, store)
    Navigation.registerComponentWithRedux('ProfileHistory',() => require('./Components/ProfileHistory').default, Provider, store )
    Navigation.registerComponentWithRedux('JoinBtn', () => require('./Components/JoinBtn').default, Provider, store)
}