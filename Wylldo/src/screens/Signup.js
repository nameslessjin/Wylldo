import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity} from 'react-native'
import firebase from 'react-native-firebase'
import { goHome } from '../navigation';

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

    onSignUpPressed = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() =>  goHome())
            .catch(error => this.setState({errorMessage: error.message}))
        
    }


    render(){

        errorMessageDisplay = null
        if (this.state.errorMessage){
            errorMessageDisplay = <Text style={{color:'red'}}>{this.state.errorMessage}</Text>
        }
        
        return(
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
                        onChangeText={name => this.setState({name})}
                         >
                    </TextInput>
                    <TextInput 
                        style={styles.inputStyle} 
                        textContentType="emailAddress"
                        placeholder='Email'
                        autoCapitalize='none'
                        onChangeText={email => this.setState({email})}
                        >
                    </TextInput>
                    <TextInput 
                        style={styles.inputStyle} 
                        textContentType="password"
                        placeholder='Password'
                        autoCapitalize='none'
                        onChangeText={password => this.setState({password})}
                        >
                    </TextInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSignUpPressed()}>
                        <Text style={{color:'white', fontFamily: 'ArialRoundedMTBold', fontSize: 20}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        height: '50%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
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