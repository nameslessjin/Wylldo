import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import defaultImg from '../assets/Savannah.jpeg'


export default class EventDispaly extends React.Component{

    render(){
        return(
            <View style={styles.container}>
                <Text>Display Event</Text>
                <Image source={defaultImg} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start'

    }
})