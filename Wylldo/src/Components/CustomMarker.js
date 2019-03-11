// custom marker component

import React from 'react'
import {View, StyleSheet,Text, TouchableOpacity} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

export default class CustomMarker extends React.Component{


    render(){
        return(
                <View style={styles.container}>
                    <View style={styles.ImgView}>
                        <Icon name="md-person" size={20}/>
                    </View>
                    <Icon name={this.props.icon} size={11} />
                </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: 30,
        height: 23,
        borderRadius: 45,
        backgroundColor: 'grey',
        flexDirection: "row"
    },
    ImgView:{
        borderRadius: 20
    }

})