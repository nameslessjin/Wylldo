import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'

export default class JoinedUserList extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: ''
                },
                rightButtons:[
                    {
                        id: 'Cancel',
                        text: 'Cancel',
                        color: '#0481fe'
                    }
                ]
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

    navigationButtonPressed({buttonId}){
        if (buttonId == 'Cancel'){
            Navigation.pop(this.props.componentId)
        }
    }

    render(){
        console.log(this.props)
        return(
            <View>
                <Text>OK</Text>
            </View>
        )
    }

}