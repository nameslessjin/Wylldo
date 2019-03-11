// custom marker component

import React from 'react'
import {View, StyleSheet,Text} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

export default class CustomMarker extends React.Component{


    render(){
        return(
            <View style={styles.container}>
                <Text>Image</Text>
                <Icon name={this.props.icon} size={13} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 50,
        backgroundColor: 'white',
        flexDirection: "row"
    }
})