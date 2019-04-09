// Page shows user settings

import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {goToAuth} from '../navigation'
import firebase from 'react-native-firebase'

export default class Settings extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text:'Profile',
                    alignment: 'center'
                }
            }
        }
    }

    onLogOutPressed = () => {
        firebase.auth().signOut().then(() => goToAuth())
    }



    render(){
        return(
            <TouchableOpacity style={styles.container} onPress={() => this.onLogOutPressed()} >
                <Text style={[styles.options, {color: "red"}]}>Log Out</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#eee'
    },
    options:{
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        margin: 5
    }
})