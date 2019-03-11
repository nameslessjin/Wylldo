import React from 'react'
import {View, StyleSheet} from "react-native"
import Icon from "react-native-vector-icons"

export default class CustomMarker extends React.Component{


    render(){
        return(
            <View style={styles.container}>
                <Text>Image</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
})