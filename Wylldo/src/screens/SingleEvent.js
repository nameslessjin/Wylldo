import React from 'react'
import {View, Image, StyleSheet} from 'react-native'
import EventDisplay from '../Components/EventDisplay'

export default class SingleEvent extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <EventDisplay {...this.props}/>
            </View>
        )
    }
}

styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'flex-start',
        width: '100%',
        height: '100%'
    }
})
