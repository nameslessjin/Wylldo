import React from 'react'
import {Text, View, StyleSheet,TextInput, TouchableOpacity,
         Keyboard, TouchableWithoutFeedback, Dimensions, Linking} from 'react-native'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'

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
        const {componentId} = this.props
        if (!this.isPasswordMatch()){
            this.setState({errorMessage: 'password is not matched'})
            return
        }

        if (!this.checkPSUEmail()){
            this.setState({errorMessage: 'Currently only PSU email is allowed to sign up new an user'})
            return
        }

        if (this.isUsernameValid(name)){

            const checkUsername = await Fire.checkUsername(name)
            if (checkUsername){
                this.setState({errorMessage: 'username already exists'})
            } else {
                const signUptResult = await Fire.signUpUser(email.trim(), password)
                if(Fire.uid){
                    await Fire.createUserInFireStore(name, email.trim())
                    Navigation.push(componentId, {
                        component:{
                            name: 'LogIn',
                            passProps: {
                                email: email.trim(),
                                password: password
                            }
                        }
                    })
                } else{
                    this.setState({errorMessage: signUptResult})
                }
            }
        } else {
            this.setState({errorMessage: 'Invalid username.  Username must be at least 6 characters and can include a-z, A-Z, 0-9 and \'-\''})
        }
    }

    checkPSUEmail = () => {
        const {email} = this.state
        const psuResult = email.search('@psu.edu')
        return (psuResult != -1) ? true : false
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
        return isValid
    }

    onLinkPress = (type) => {
        if (type === 'policy'){
            Linking.openURL(
                'https://www.termsfeed.com/privacy-policy/0c7ef35358c0ec37aac93f605fce9336'
            ).catch(err => console.error('An error occurred', err))
        }
        else if (type === 'terms'){
            Linking.openURL(
                'https://www.termsfeed.com/terms-conditions/2e4adbc0c1a7140c89a3deb7fd3093f7'
            ).catch(err => console.error('An error occurred', err))
        }
        else if (type === 'EULA'){
            Linking.openURL(
                'https://www.termsfeed.com/eula/c022892bab1e17ff6e6e24f70ee0da59'
            ).catch(err => console.error('An error occurred', err))
        }
    }


    render(){
        const {Focus, errorMessage, inputHeight} = this.state
        errorMessageDisplay = null
        if (errorMessage){
            errorMessageDisplay = <Text style={{color:'red'}} numberOfLines={2} >{errorMessage}</Text>
        }

        const termNPolicy = (
            <View style={{marginTop: 15}}>
                <Text adjustsFontSizeToFit style={styles.hyperLinkText}>By signing up, you agree to our </Text>
                <View style={{flexDirection:'row'}}>
                    <Text 
                        adjustsFontSizeToFit
                        style={[styles.hyperLinkText, {fontWeight: 'bold'}]}
                        onPress={() => this.onLinkPress('terms')}
                    >Terms</Text>
                    <Text adjustsFontSizeToFit style={styles.hyperLinkText}>, </Text>
                    <Text 
                        adjustsFontSizeToFit
                        style={[styles.hyperLinkText, {fontWeight: 'bold'}]}
                        onPress={() => this.onLinkPress('policy')}
                    >Privacy Policy</Text>
                    <Text adjustsFontSizeToFit style={styles.hyperLinkText}> and </Text>
                    <Text
                        adjustsFontSizeToFit
                        style={[styles.hyperLinkText, {fontWeight: 'bold'}]}
                        onPress={() => this.onLinkPress('EULA')} 
                    >EULA</Text>
                </View>
            </View>
        )
        
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={[styles.inputContainer, (Focus) ? {bottom: inputHeight} : null]}>
                        <Text adjustsFontSizeToFit style={styles.wylldoTextStyle}>Wylldo</Text>
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
                            <Text adjustsFontSizeToFit style={{color:'white', fontFamily: 'Jellee-Roman', fontSize: 20}}>Sign Up</Text>
                        </TouchableOpacity>
                        {termNPolicy}
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
        fontFamily: 'Jellee-Roman',
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
        backgroundColor: '#FE4C4C',
        marginTop: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hyperLinkText:{
        color: 'grey',
    }
})