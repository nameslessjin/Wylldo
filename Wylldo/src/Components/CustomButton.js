//custom button component
import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const CustomButton = props => {
    const content = (
        <View style={styles.button}>
            <Icon  name={props.name} size={Number(props.size)} color={props.color}/>
        </View>
    )

    return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>
}

const styles = StyleSheet.create({
    button:{
        margin: 5
    }
})

export default CustomButton