import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {goToAuth} from '../navigation'
import firebase from 'react-native-firebase'
import {connect} from 'react-redux'
import {signOut} from '../store/actions/action.index'

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

    
    logOutBtn = () => {
        return(
            <TouchableOpacity style={styles.optionBtn} onPress={() => this.onLogOutPressed()} >
                <Text style={styles.logOutText}>Log Out</Text>
            </TouchableOpacity>
        )
    }

    editProfileBtn = () => {
        return(
            <TouchableOpacity style={styles.optionBtn}>
                <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
        )
    }


    render(){
        return(
            <View style={styles.container}>
                {this.logOutBtn()}
                {this.editProfileBtn()}
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
    optionBtn:{
        width: '90%',
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginVertical: 10,
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