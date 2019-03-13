import React from 'react'
import {StyleSheet, FlatList,View} from 'react-native'
import EventDisplay from '../Components/EventDisplay'
import {Navigation} from 'react-native-navigation'

export default class ListEvents extends React.Component{
    
    componentDidAppear(){
        console.log(this.props.events)
    }

    render(){
        return(
            <View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: "100%"
        
    }
})