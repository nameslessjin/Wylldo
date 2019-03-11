// custom marker component

import React from 'react'
import {View, StyleSheet} from "react-native"
import Icon from "react-native-vector-icons"

export default class CustomMarker extends React.Component{


    render(){
        return(
            <View style={styles.container}>
                <Text>Image</Text>
                <Text>Tag</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 50,
        backgroundColor: 'red',
        flexDirection: "row"
    }
})