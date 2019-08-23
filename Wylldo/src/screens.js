// Screen register page
import {Navigation} from 'react-native-navigation'
import {Provider} from 'react-redux'
import {store} from './store/configureStore'


// "Home, WylldoList, AddMap, Settings and Profile page are connected with redux to help manage and store data locally through store from configureStore"
export function registerScreens(){
    Navigation.registerComponentWithRedux('Home', () => require('./screens/Home').default, Provider, store)
    Navigation.registerComponentWithRedux('WylldoList', () => require('./screens/WylldoList').default, Provider, store)
    Navigation.registerComponentWithRedux('AddEvent', () => require('./screens/AddEvent').default, Provider, store)
    Navigation.registerComponentWithRedux('Settings', () => require('./screens/Settings').default, Provider, store)
    Navigation.registerComponentWithRedux('FollowerSelect', () => require('./screens/FollowerSelect').default, Provider, store)
    Navigation.registerComponentWithRedux('SingleEvent', () => require('./screens/SingleEvent').default, Provider, store)
    Navigation.registerComponentWithRedux('MultiEventDisplay', () => require('./screens/MultiEventDisplay').default, Provider, store)
    Navigation.registerComponentWithRedux('JoinedUserList', () => require('./screens/JoinedUserList').default, Provider, store)
    Navigation.registerComponentWithRedux('MainProfile', () => require('./screens/MainProfile').default, Provider, store)
    Navigation.registerComponentWithRedux('Following', () => require('./screens/Following').default, Provider, store)
    Navigation.registerComponentWithRedux('Follower', () => require('./screens/Follower').default, Provider, store)
    Navigation.registerComponentWithRedux('Comment', () => require('./screens/Comment').default, Provider, store)
    Navigation.registerComponentWithRedux('OtherProfile', () => require('./screens/OtherProfile').default, Provider, store)
    Navigation.registerComponentWithRedux('EditProfile', () => require('./screens/EditProfile').default, Provider, store)
    Navigation.registerComponentWithRedux('UserSearch', () => require('./screens/UserSearch').default, Provider, store)
    Navigation.registerComponent('UserInvite', () => require('./screens/UserInvite').default)
    Navigation.registerComponent('Initializing', () => require('./screens/Initializing').default)
    Navigation.registerComponent('LogIn', () => require('./screens/LogIn').default)
    Navigation.registerComponent('SignUp', () => require('./screens/SignUp').default)
    Navigation.registerComponent('AddMap', () => require('./screens/AddMap').default)
    Navigation.registerComponent('ShowMap', () => require('./screens/ShowMap').default)
    Navigation.registerComponent('Auth', () => require('./screens/Auth').default)
    Navigation.registerComponent('ForgetPassword', () => require('./screens/ForgetPassword').default)
  


    //this is not a screen
    Navigation.registerComponentWithRedux('EventOption', () => require('./Components/EventOption').default, Provider, store)
    Navigation.registerComponentWithRedux('JoinBtn', () => require('./Components/JoinBtn').default, Provider, store)
    Navigation.registerComponentWithRedux('FollowButton', () => require('./Components/FollowButton').default, Provider. store)
    Navigation.registerComponentWithRedux('CommentInput', () => require('./Components/CommentInput').default, Provider, store)
    Navigation.registerComponentWithRedux('UserDisplay', () => require('./Components/UserDisplay').default, Provider, store)
    // Navigation.registerComponentWithRedux('CommentDisplay', () => require('./Components/CommentDisplay').default, Provider, store)
}