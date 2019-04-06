// custom marker component

import React from 'react'
import {View, StyleSheet,Text, TouchableOpacity} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

export default class CustomMarker extends React.Component{


    render(){
        return(
                <View style={styles.container}>
                    <View style={styles.ImgView}>
                        <Icon name="md-person" size={25}/>
                    </View>
                    <Icon name={this.props.icon} size={15} />
                </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: 42,
        height: 30,
        borderRadius: 45,
        backgroundColor: '#e55039',
        flexDirection: "row",
        alignItems: 'center'
    },
    ImgView:{
        borderRadius: 50,
        height: '90%',
        aspectRatio: 1,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center'
    }

})