import React from 'react'
import { TextInput, View, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Fire from '../firebase/Fire'
import firebase from 'react-native-firebase'

export default class ForgetPassword extends React.Component{

    static get options(){
        return{
            topBar:{
                noBorder: true,
                backButton:{
                    title: 'Login'
                },
            }
        }
    }

    state = {
        email: (this.props.email) ? this.props.email : '',
        resetPasswordPress: false,
        errorMessage: '',
        resetText: 'An email to reset password is sent to the entered email address'
    }

    onResetPasswordPressed = async() => {
        const {email} = this.state
        this.setState({resetPasswordPress: true})
        const resetResult = await Fire.resetPassword(email)
        if (resetResult){
            this.setState({errorMessage: resetResult.message})
        } else {
            this.setState({errorMessage: ''})
        }
    }

    render(){
        const {resetPasswordPress, errorMessage, resetText} = this.state
        const {email} = this.state
        resetPasswordText = (resetPasswordPress) ? (
            <Text style={{width: '90%'}} numberOfLines={2}>{(errorMessage != '') ? errorMessage : resetText}</Text>
        ) : null

        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container} >
                    <View style={styles.inputWrapper}>
                        {resetPasswordText}
                        <TextInput
                            placeholder='Enter your email'
                            onChangeText={(text) => this.setState({email: text})}
                            value={email}
                            style={styles.textInput}
                        />
                        <TouchableOpacity style={styles.buttonStyle} onPress={this.onResetPasswordPressed}>
                            <Text style={styles.wylldoTextStyle}>Send email</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    inputWrapper:{
        width: '100%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        top: '15%'
    },
    textInput:{
        width:'90%',
        height: '10%',
        backgroundColor: 'grey',
        marginTop: 5,
        borderRadius: 15,
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 10,
        marginTop: 5
    },
    buttonStyle:{
        height: '10%',
        width: '80%',
        backgroundColor: '#FE4C4C',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wylldoTextStyle:{
        fontSize: 20,
        fontFamily: 'Jellee-Roman',
        color: 'white'
    },

})