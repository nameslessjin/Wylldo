import React from 'react'
import {View, Image, StyleSheet, Text} from 'react-native'

export default class PopUpWnd extends React.Component{

    render(){
        console.log(this.props)
        return(
            <View style={styles.container}>
                <View style={styles.displayContainer}>
                    <Text>{this.props.description}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        width: "90%",
        height: "35%",
        backgroundColor: "white",
        borderRadius: 20,
        position: 'absolute',
        top: "64%",
        left: "5%" ,
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayContainer:{
        width: "95%",
        height: '95%'
    }
})