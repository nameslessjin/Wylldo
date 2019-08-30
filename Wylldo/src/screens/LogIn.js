import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {goHome} from '../navigation'
import firebase from 'react-native-firebase'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'

export default class SignIn extends React.Component{
    static get options(){
        return{
            topBar:{
                noBorder: true,
                backButton:{
                    title: 'Back'
                },
            }
        }
    }

    state={
        email: (this.props.email) ? this.props.email : '',
        password: (this.props.password) ? this.props.password : '',
        errorMessage: null,
        requestEmailVerification: false,
        verifyBtnPress: false
    }

    onLogInPressed = async() => {
        this.setState({requestEmailVerification: false, verifyBtnPress: false})
        const {email, password} = this.state
        const logInResult = await Fire.userLogin(email, password)
        if (logInResult.message){
            this.setState({errorMessage: logInResult.message})
            return
        } else {
            firebase.auth().onAuthStateChanged(user => {
                if (user){
                    if (user.emailVerified){
                        this.checkNotificationPermission()
                        goHome()
                    } else {
                        this.setState({errorMessage: 'User email must be verified before login', requestEmailVerification: true})
                    }
                }
            })
        }  
    }
    
    onVerifyEmailPress = () => {
        Fire.requestEmailVerification()
        this.setState({verifyBtnPress: true})
    }
    
    checkNotificationPermission = async () => {
        await Fire.checkMessagePermission()
    }

    onForgetPasswordPress = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'ForgetPassword',
                passProps:{
                    email: this.state.email
                }
            }
        })
    }


    render(){
        const {errorMessage, requestEmailVerification, verifyBtnPress} = this.state
        errorMessageDisplay = null
        requestEmailVerificationBtn = null
        if (errorMessage){
            errorMessageDisplay = <Text adjustsFontSizeToFit style={{color:'red'}}>{errorMessage}</Text>
        }
        if (requestEmailVerification){
            requestEmailVerificationBtn = (
                <TouchableOpacity onPress={this.onVerifyEmailPress}>
                    <Text adjustsFontSizeToFit style={styles.verifyEmailText}>
                        {!(verifyBtnPress) ?
                        'Verify email' : 'resend email'}
                    </Text>
                </TouchableOpacity>
            )
        }

        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container} onPress={Keyboard.dismiss}>
                    <View style={styles.inputContainer}>
                        <Text adjustsFontSizeToFit style={styles.wylldoTextStyle}>Wylldo</Text>
                        {errorMessageDisplay}
                        {requestEmailVerificationBtn}
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType={"emailAddress"} 
                            placeholder={'Email'} 
                            autoCapitalize='none'
                            maxLength={30}
                            onChangeText={email => this.setState({email})}></TextInput>
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType={"password"} 
                            placeholder={'Password'}
                            autoCapitalize='none'
                            secureTextEntry={true}
                            maxLength={30}
                            onChangeText={password => this.setState({password})}></TextInput>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onLogInPressed()}>
                            <Text adjustsFontSizeToFit style={{color:'white', fontFamily: 'Jellee-Roman', fontSize: 20}}>Log In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.forgotPasswordBtn} onPress={this.onForgetPasswordPress}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    inputStyle:{
        width:'90%',
        height: '10%',
        backgroundColor: 'grey',
        marginTop: 5,
        borderRadius: 15,
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 10
    },
    inputContainer:{
        height: '80%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    wylldoTextStyle:{
        fontSize: 30,
        // fontFamily: 'ArialRoundedMTBold',
        fontFamily: 'Jellee-Roman' ,
        marginBottom: 20
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
    verifyEmailText:{
        color: '#0481fe'
    },
    forgotPasswordBtn:{
        marginTop: 20
    },
    forgotPasswordText:{
        color: '#0481fe'
    }
})