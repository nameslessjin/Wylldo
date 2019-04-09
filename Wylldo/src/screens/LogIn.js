import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity, Keyboard} from 'react-native'
import {goHome} from '../navigation'
import firebase from 'react-native-firebase'

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
        email: '',
        password: '',
        errorMessage: null
    }

    onLogInPressed = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => goHome())
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
                        textContentType={"emailAddress"} 
                        placeholder={'Emaill'} 
                        autoCapitalize='none'
                        onChangeText={email => this.setState({email})}></TextInput>
                    <TextInput 
                        style={styles.inputStyle} 
                        textContentType={"password"} 
                        placeholder={'Password'}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={password => this.setState({password})}></TextInput>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onLogInPressed()}>
                        <Text style={{color:'white', fontFamily: 'ArialRoundedMTBold', fontSize: 20}}>Log In</Text>
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
        height: '50%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    wylldoTextStyle:{
        fontSize: 30,
        fontFamily: 'ArialRoundedMTBold',
        marginBottom: 20
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