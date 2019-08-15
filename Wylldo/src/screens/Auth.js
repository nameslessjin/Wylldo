// initialize page when app just start.  Authentication page

import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { Navigation } from 'react-native-navigation';


//AppLaunch here and load some events add load screen and connect his part to reducer

export default class Auth extends React.Component{
    static get options(){
        return{
            topBar:{
                visible: false,
                height: 0
            }
        }
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

        return(
            <View style={styles.container}>
                <View style={styles.displayLabelContainer}>
                    <Text adjustsFontSizeToFit style={[styles.labelStyle, {fontSize: 70, color: 'white'}]}>Wylldo</Text>
                </View>
                <TouchableOpacity style={styles.signUpdisplay} onPress={() => this.onSignUpPressed()}>
                    <Text adjustsFontSizeToFit style={styles.displayText}>SIGN UP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logIndisplay} onPress={() => this.onLoginPressed()}>
                    <Text adjustsFontSizeToFit style={styles.displayText}>LOG IN</Text>
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
        backgroundColor: '#f3a683'
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
        fontSize: 25,
        color: 'white',
        fontFamily: 'ArialRoundedMTBold'
    },
    signUpdisplay:{
        backgroundColor: '#e74c3c',
        width: '90%',
        height: '6%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    logIndisplay:{
        backgroundColor: '#fdcb6e',
        width: '90%',
        height: '6%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 70,
        marginTop: 10
    }

})