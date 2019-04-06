import React from 'react'
import {View, Image, StyleSheet} from 'react-native'
import EventDisplay from '../Components/EventDisplay'

export default class SingleEvent extends React.Component{
    render(){
        return(
            <EventDisplay {...this.props}/>
        )
    }
}
