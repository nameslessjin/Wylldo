import React from 'react'
import {Text, View, StyleSheet, LayoutAnimation, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import PickAvatar from '../Components/PickAvatar'
import Fire from '../firebase/Fire'
import { Navigation } from 'react-native-navigation';
import {getCurrentUser} from '../store/actions/action.index'


class EditProfile extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Edit Profile'
                },
                rightButtons:[
                    {
                        id: 'Done',
                        text: 'Done',
                        color: '#0481fe'
                    }
                ],
                backButton:{
                    showTitle: false
                }
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        }
    }

    constructor(props){
        super(props)
        Navigation.events().bindComponent(this)
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.avatarUri != this.state.avatarUri){
            this.setState({avatarChange: true})
        }
    }

    navigationButtonPressed({buttonId}){
        const {username, gender, email, phone_num, birth_date, avatarUri, avatarChange} = this.state
        if (buttonId == "Done"){
            const currentUser = {
                ...this.props.currentUser,
                username: username,
                gender: gender,
                email: email,
                phone_num: phone_num,
                birth_date: birth_date
            }

            this.updateUserData(currentUser, (avatarChange) ? avatarUri : null).then(() => {
                this.getCurrentUserData().then(currentUserData => {
                    this.props.onGetCurrentUser(currentUserData)
                    Navigation.popToRoot(this.props.componentId)
                })
            })
        }
    }

    updateUserData = async(currentUser, avatarUri) => {
        await Fire.updateUserInformation(currentUser, avatarUri)
    }

    getCurrentUserData = async () => {
        const currentUserData = await Fire.getUserData(Fire.uid)
        return currentUserData
    }

    state = {
        currentUser: {...this.props.currentUser},
        username: this.props.currentUser.username,
        phone_num: this.props.currentUser.phone_num,
        birth_date: this.props.currentUser.birth_date,
        gender: this.props.currentUser.gender,
        email: this.props.currentUser.email,
        avatarUri: this.props.currentUser.avatarUri,
        avatarChange: false,
        resetPasswordPress: false,
        errorMessage: ''
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

    onBlur = () => {
        console.log('onBlue')
    }


    updateAvatar = (avatarUri) =>{
        this.setState({avatarUri: avatarUri})
    }

    render(){
        const {avatarUri} = this.props.currentUser
        const {username, email, phone_num, resetPasswordPress, errorMessage} = this.state

        resetPasswordText = (resetPasswordPress) ? (
            <Text style={{width: '90%'}} numberOfLines={2}>{(errorMessage != '') ? errorMessage : 'Email sent'}</Text>
        ) : null

        LayoutAnimation.easeInEaseOut()

        const usernameDisplay = (
            <View style={styles.userInputContainer}>
                <Text adjustsFontSizeToFit style={styles.userInputText}>Username</Text>
                <TextInput 
                    defaultValue={username}
                    style={[styles.userInputTextInput, {backgroundColor: '#bdc3c7'}]}
                    maxLength={22}
                    editable={false}
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>
        )

        const emailDisplay = (
            <View style={styles.userInputContainer}>
                <Text adjustsFontSizeToFit style={styles.userInputText}>Email</Text>
                <TextInput
                    defaultValue={email}
                    style={[styles.userInputTextInput, {backgroundColor: '#bdc3c7'}]}
                    maxLength={30}
                    editable={false}
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>
        )

        const phoneDisplay = (
            <View style={styles.userInputContainer}>
                <Text adjustsFontSizeToFit style={styles.userInputText}>Phone</Text>
                <TextInput
                    defaultValue={phone_num}
                    style={styles.userInputTextInput}
                    maxLength={10}
                    onChangeText={(phone_num) => this.setState({phone_num: phone_num})}
                    keyboardType={'phone-pad'}
                    onSubmitEditing={Keyboard.dismiss}
                    onBlur={this.onBlur}
                />
            </View>
        )

        const resetPassword = (
            <TouchableOpacity onPress={this.onResetPasswordPressed} style={styles.resetPasswordContainer}>
                <Text adjustsFontSizeToFit style={styles.resetPasswordText}>Reset Password</Text>
            </TouchableOpacity>
        )

        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <PickAvatar  
                        avatarUri={avatarUri}
                        updateAvatar={(avatarUri) => this.updateAvatar(avatarUri)}
                    />
                    <View/>
                    <View style={styles.userInfoContainer}>
                        {usernameDisplay}
                        {emailDisplay}
                        {phoneDisplay}
                        {resetPassword}
                        {resetPasswordText}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetCurrentUser: (currentUserData) => dispatch(getCurrentUser(currentUserData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    userInfoContainer:{
        marginTop: 30,
        width: '85%'
    },
    userInputContainer:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'flex-start',
        marginBottom: 20
    },
    userInputText:{
        fontSize: 14,
        width: '30%'
    },
    userInputTextInput:{
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: 'grey',
        width: '70%'
    },
    resetPasswordText:{
        fontSize: 14,
        color: '#0481fe'
    },
    resetPasswordContainer:{
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10
    }
})