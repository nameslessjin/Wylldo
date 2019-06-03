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
            }
        }
    }

    onLogOutPressed = () => {
        this.props.onSignOut()
        firebase.auth().signOut().then(() => goToAuth())
    }

    


    render(){
        return(
            <TouchableOpacity style={styles.container} onPress={() => this.onLogOutPressed()} >
                <Text style={[styles.options, {color: "red"}]}>Log Out</Text>
            </TouchableOpacity>
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
        alignItems: 'flex-start',
        backgroundColor: '#eee'
    },
    options:{
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
        margin: 5
    }
})