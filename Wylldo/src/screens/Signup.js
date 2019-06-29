import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Dimensions} from 'react-native'
import { goHome } from '../navigation';
import Fire from '../firebase/Fire'

const {height, width} = Dimensions.get('window')

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
        password_confirm: '',
        errorMessage: null,
        inputHeight: 0,
        Focus: false
    }

    onFocus = () => {
        this.setState({Focus: true})
    }

    onBlur = () => {
        this.setState({Focus: false})
    }

    componentWillMount(){
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidSHow)
    }

    componentWillUnmount(){
        this.keyboardDidShowSub.remove()
    }

    handleKeyboardDidSHow = (event) => {
        const componentHeight = height * 0.05
        this.setState({inputHeight: componentHeight})
    }

    onSignUpPressed = async () => {
        const {email, password, name} = this.state

        if (!this.isPasswordMatch()){
            this.setState({errorMessage: 'password is not matched'})
            return
        }

        if (this.isUsernameValid(name)){

            const checkUsername = await Fire.checkUsername(name)
            if (checkUsername){
                this.setState({errorMessage: 'username already exists'})
            } else {
                const signUptResult = await Fire.signUpUser(email, password)
                if(Fire.uid){
                    await Fire.createUserInFireStore(name, email)
                    goHome()
                } else{
                    this.setState({errorMessage: signUptResult})
                }
            }
        } else {
            this.setState({errorMessage: 'Invalid username.  Username must be at least 6 characters and can include a-z, A-Z, 0-9 and \'-\''})
        }
    }

    isPasswordMatch = () => {
        const {password, password_confirm} = this.state
        return password === password_confirm
    }

    isUsernameValid = (username) => {
        if (username.length < 6 || username > 22){
            return false
        }
        const validUsername = /^[a-zA-Z0-9\_]+$/
        const isValid = validUsername.test(username)
        console.log(isValid)
        return isValid
    }


    render(){
        const {Focus, errorMessage, inputHeight} = this.state
        errorMessageDisplay = null
        if (errorMessage){
            errorMessageDisplay = <Text style={{color:'red'}} numberOfLines={2} >{errorMessage}</Text>
        }
        
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={[styles.inputContainer, (Focus) ? {bottom: inputHeight} : null]}>
                        <Text style={styles.wylldoTextStyle}>Wylldo</Text>
                        {errorMessageDisplay}
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType="name"
                            placeholder='Username'
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
                            secureTextEntry={true}
                            maxLength={40}
                            onChangeText={password => this.setState({password})}
                            >
                        </TextInput>
                        <TextInput 
                            style={styles.inputStyle} 
                            textContentType="password"
                            placeholder='confirm password'
                            autoCapitalize='none'
                            secureTextEntry={true}
                            maxLength={40}
                            onChangeText={password_confirm => this.setState({password_confirm})}
                            onFocus = {this.onFocus}
                            onBlur = {this.onBlur}
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