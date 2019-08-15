import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {goToAuth} from '../navigation'
import firebase from 'react-native-firebase'
import {connect} from 'react-redux'
import {signOut} from '../store/actions/action.index'
import {Navigation} from 'react-native-navigation'

class Settings extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Settings',
                    alignment: 'center'
                }
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        }
    }

    onLogOutPressed = () => {
        this.props.onSignOut()
        firebase.auth().signOut().then(() => goToAuth())
    }

    onEditProfilePressed = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'EditProfile'
            }
        })
    }

    
    logOutBtn = () => {
        return(
            <TouchableOpacity style={[styles.optionBtn]} onPress={this.onLogOutPressed} >
                <Text adjustsFontSizeToFit style={styles.logOutText}>Log Out</Text>
            </TouchableOpacity>
        )
    }

    editProfileBtn = () => {
        return(
            <TouchableOpacity style={[styles.optionBtn, {marginTop: 10}]} onPress={this.onEditProfilePressed}>
                <Text adjustsFontSizeToFit style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
        )
    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.optionContainer}> 
                    {this.editProfileBtn()}
                    {this.logOutBtn()}
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onSignOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(Settings)


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#eee'
    },
    optionContainer:{
        backgroundColor: 'white',
        width: '100%'
    },
    optionBtn:{
        width: '100%',
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: "#fff",
    },
    logOutText:{
        color: 'red',
        fontSize: 15,
        marginLeft: 10
    },
    optionText:{
        fontSize: 15,
        marginLeft: 10
    }
})