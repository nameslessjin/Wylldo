//Page represent events

import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import  {Navigation} from 'react-native-navigation'


export default class EventTable extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'What\'s Happening',
                    alignment: 'center'
                },
                rightButtons:[
                    {
                        id: 'addEvent',
                        text: 'Wylldo',
                        color: '#0481fe'

                    }
                ]
            }
        }
    }


    constructor(props){
        super(props);
        Navigation.events().bindComponent(this);
        

    }

    navigationButtonPressed({buttonId}){
        if (buttonId == "addEvent"){
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'AddEvent'
                }
            })
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