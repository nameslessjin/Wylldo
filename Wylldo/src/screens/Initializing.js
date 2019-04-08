// initialize page when app just start.  Authentication page

import React from 'react'
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity} from 'react-native'

import {goToAuth, goHome} from '../navigation'
import {USER_KEY} from '../config'
import Icon from 'react-native-vector-icons/Ionicons'
import { Navigation } from 'react-native-navigation';


//AppLaunch here and load some events add load screen and connect his part to reducer

export default class Initializing extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Back'
                },
                visible: false,
                height: 0
            }
        }
    }

    async componentDidMount(){
        // goHome()
    }

    onSignUpPressed = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name:'SignUp'
            }
        })

    }

    onLoginPressed = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name:'LogIn'
            }
        })
    }


    render(){
        console.log(this.props.componentId)

        return(
            <View style={styles.container}>
                <View style={styles.displayLabelContainer}>
                    <Text style={[styles.labelStyle, {fontSize: 25, color:'white'}]}>Welcome To</Text>
                    <Text style={[styles.labelStyle, {fontSize: 70, color: '#ffbe76'}]}>Wylldo</Text>
                </View>
                <TouchableOpacity style={styles.signUpdisplay} onPress={() => this.onSignUpPressed()}>
                    <Text style={styles.displayText}>SIGN UP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logIndisplay} onPress={() => this.onLoginPressed()}>
                    <Text style={styles.displayText}>LOG IN</Text>
                </TouchableOpacity>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#ffeaa7'
    },
    displayLabelContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: '80%',
        width: '100%',
    },
    labelStyle:{
        fontFamily: 'ArialRoundedMTBold'
    },
    displayText:{
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
    },
    signUpdisplay:{
        backgroundColor: '#e74c3c',
        width: '90%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    logIndisplay:{
        backgroundColor: '#fdcb6e',
        width: '90%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 30,
        marginTop: 5
    }

})