import React from 'react'
import {View, Text} from 'react-native'


export default class followerSelect extends React.Component{

    static options(){
        return{
            bottomTabs:{
                visible: false
            },
            topBar:{
                title:{
                    text: 'Followers',
                    alignment: 'center'
                }
            }
        }
    }

    render(){

        return(
            <View>
                <Text>Select Followers</Text>
            </View>
        )
    }
}