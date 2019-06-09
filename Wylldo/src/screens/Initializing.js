// initialize page when app just start.  Authentication page

import React from 'react'
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, YellowBox} from 'react-native'
import {goToAuth, goHome} from '../navigation'
import Fire from '../firebase/Fire'

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

    render(){

        //if user is loged in move to home page.  (some concern about user token)
        //else move to authorization page
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