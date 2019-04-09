// initialize page when app just start.  Authentication page

import React from 'react'
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, YellowBox} from 'react-native'
import {goToAuth, goHome} from '../navigation'
import Fire from '../firebase/Fire'

YellowBox.ignoreWarnings([
    'Require cycle:', 
    'Accessing view manager configs directly off UIManager via UIManager[\'AIRGoogleMap\']'
])
//AppLaunch here and load some events add load screen and connect his part to reducer

export default class Initializing extends React.Component{
    static get options(){
        return{
            topBar:{
                visible: false,
                height: 0
            }
        }
    }

    // constructor() {
    //     super()
    //     this.unsubscriber = null
    //     this.state ={
    //         user:null
    //     }
    // }

    // componentDidMount(){

    //     //Check if user is logged in.  If not go to Auth page else Home page
    //     this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
    //         this.setState({user})
    //     })
    // }

    // componentWillUnmount(){
    //     if(this.unsubscriber){
    //         this.unsubscriber()
    //     }
    // }


    render(){

        if (Fire.uid){
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