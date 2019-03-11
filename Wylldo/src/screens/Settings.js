// Page shows user settings

import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default class Settings extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text:'Settings'
                }
            }
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={[styles.options, {color: "red"}]}>Log Out</Text>
            </View>
        )
    }
}

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