import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import defaultImg from '../assets/Savannah.jpeg'


export default class EventDispaly extends React.Component{

    render(){

        const displayImage = <Image source={defaultImg} style={styles.image} />
        
        return(
            <View>

                {displayImage}
                <Text>{this.props.description}</Text>
                
                
                
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'flex-start',
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        marginBottom: 3,

    },
    imageView:{
        width: "100%",
        height: "40%",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow',
    },
    image:{
        resizeMode: 'contain',
        aspectRatio: 0.5
    }
})