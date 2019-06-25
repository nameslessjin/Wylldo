// initialize page when app just start.  Authentication page
import React from 'react'
import { View, Text, StyleSheet, YellowBox} from 'react-native'
import {goToAuth, goHome} from '../navigation'
import Fire from '../firebase/Fire'
import firebase from 'react-native-firebase'

//Thinking if should make this a loading screen page.  Not entirely sure if the app is closed and reopen, this page still will be initialization page 

//temporarily getting rid of warning message that won't hurt
YellowBox.ignoreWarnings([
    'Require cycle:', 
    'Accessing view manager configs directly off UIManager via UIManager[\'AIRGoogleMap\']',
    'Accessing view manager configs directly off UIManager via UIManager[\'AIRMapLite\']',
    'Accessing view manager configs directly off UIManager via UIManager[\'AIRMap\']',
    
])


export default class Initializing extends React.Component{
    static get options(){
        return{
            topBar:{
                visible: false,
                height: 0
            }
        }
    }

    constructor(){
        super()
        this.state = {
            loggedIn: false
        }
    }

    componentDidMount(){
        this.onAuth = firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.setState({loggedIn: true})
                this.checkNotificationPermission()

            } else {
                this.setState({loggedIn: false})
            }
        })
    }

    componentWillUnmount(){
        this.onAuth()
    }

    checkNotificationPermission = async () => {
        await Fire.checkMessagePermission()
    }

    render(){
        //if user is loged in move to home page.  (some concern about user token)
        //else move to authorization page
        if (this.state.loggedIn){
            goHome()
        } else{
            goToAuth()
        }

        return(
            <View style={styles.container}>
                <Text style={styles.displayText}>Loading...</Text>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3a683'
    },
    displayText:{
        fontSize: 30,
        color: 'white',
        fontFamily: 'ArialRoundedMTBold'
    },

})