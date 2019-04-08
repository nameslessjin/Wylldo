import React from 'react'
import {Text, View, StyleSheet} from 'react-native'


export default class SignIn extends React.Component{

    render(){
        console.log('LogIn')
        return(
            <View style={styles.container}>
                <Text>Log In</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})