import React from 'react'
import {View, Text} from 'react-native'

export default class addEvent extends React.Component{
    static get options(){
        return{
            bottomTabs:{
                visible: false
            }
        }

    }
    render(){
        return(
            <View>
                <Text>Add Screen Page</Text>
            </View>

        )
    }
}