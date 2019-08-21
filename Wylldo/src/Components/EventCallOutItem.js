import React from 'react'
import { View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"

export default class EventCallOutItem extends React.Component{

    _onPress = () => {
        console.log(this.props.id)
    }

    render() {
        const {icon, hostAvatar, likes, id} = this.props
        return (
            <TouchableOpacity 
                style={[styles.container, likes >= 10 ? {backgroundColor: 'e74c3c'} : null]}
                onPress={this._onPress}
                >
                <Image
                    source = {hostAvatar}
                    style={styles.imgStyle}
                />
                <Icon name={icon} size={15} />
            </TouchableOpacity>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        height: 35,
        padding: 3,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    imgStyle:{
        height: '95%',
        aspectRatio: 1,
        borderRadius: 14,
    }
})