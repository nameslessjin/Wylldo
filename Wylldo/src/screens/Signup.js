import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native'
import { goHome } from '../navigation';
import Fire from '../firebase/Fire'

export default class SignIn extends React.Component{

    static get options(){
        return{
            topBar:{
                noBorder: true,
                backButton:{
                    title: 'Back'
                }
            }
        }
    }

    state={
        email: '',
        password: '',
        name: '',
        errorMessage: null
    }

    onSignUpPressed = async () => {
        const {email, password, name} = this.state
        const checkUsername = await Fire.checkUsername(name)
        if (checkUsername){
            this.setState({errorMessage: 'username already exists'})
        } else {
            const signUptResult = await Fire.signUpUser(email, password)
            console.log(signUptResult)
            if(Fire.uid){
                await Fire.createUserInFireStore(name, email)
                goHome()
            } else{
                this.setState({errorMessage: signUptResult})
            }
        }

        
    }

    userSignUp = async (email, password, name) => {
        const signUptResult = await Fire.signUpUser(email, password, name)
        console.log(signUptResult)
        return signUptResult
    }



    render(){

        errorMessageDisplay = null
        if (this.state.errorMessage){
            errorMessageDisplay = <Text style={{color:'red'}} numberOfLines={2} >{this.state.errorMessage}</Text>
        }
        
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.wylldoTextStyle}>Wylldo</Text>
                        {errorMessageDisplay}
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType="name"
                            placeholder='Full name'
                            autoCapitalize='none'
                            autoCorrect={false}
                            maxLength={22}
                            onChangeText={name => this.setState({name})}
                            >
                        </TextInput>
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType="emailAddress"
                            placeholder='Email'
                            autoCapitalize='none'
                            maxLength={40}
                            onChangeText={email => this.setState({email})}
                            >
                        </TextInput>
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType="password"
                            placeholder='Password'
                            autoCapitalize='none'
                            maxLength={40}
                            onChangeText={password => this.setState({password})}
                            >
                        </TextInput>
                        <TouchableOpacity style={styles.buttonStyle} onPress={this.onSignUpPressed}>
                            <Text style={{color:'white', fontFamily: 'ArialRoundedMTBold', fontSize: 20}}>Sign Up</Text>
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
    wylldoTextStyle:{
        fontSize: 30,
        fontFamily: 'ArialRoundedMTBold',
        marginBottom: 20
    },
    inputContainer:{
        height: '80%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    buttonStyle:{
        height: '10%',
        width: '80%',
        backgroundColor: '#e74c3c',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }
})