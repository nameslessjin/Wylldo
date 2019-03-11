//Page represent events

import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default class EventTable extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Events'
                }
            }
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <Text></Text>
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
    }
})