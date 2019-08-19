// custom marker component
import React from 'react'
import {View, StyleSheet, Text, ImageBackground} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

export default class CustomMarker extends React.Component{


    render(){
        return(
                <View style={[styles.container, this.props.likes >= 10 ? {backgroundColor: '#e74c3c'} : null]}>
                    <View style={styles.ImgView}>
                        <ImageBackground 
                            source={this.props.hostAvatar} 
                            style={styles.imgStyle} imageStyle={{borderRadius: 15, resizeMode: 'cover'}} 
                            onLoad={() => this.forceUpdate()}>
                            <Text adjustsFontSizeToFit style={{width: 0, height: 0}}>{Math.random()}</Text> 
                        </ImageBackground>
                    </View>
                    <Icon name={this.props.icon} size={15} />
                </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: 43,
        height: 32,
        borderRadius: 45,
        backgroundColor: '#ced6e0',
        flexDirection: "row",
        alignItems: 'center',

    },
    ImgView:{
        borderRadius: 50,
        height: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    imgStyle:{
        height: '100%',
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 60
    }

})