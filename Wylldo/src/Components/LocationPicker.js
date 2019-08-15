import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native'

const {height, width} = Dimensions.get('window')
export default class LocationPicker extends React.Component{

    setLocation = () => {
        const {pinLocation, searchLocation, chooseLocation} = this.props
        let location = pinLocation.short_address
        if (searchLocation){
            if (pinLocation.coords.latitude == searchLocation.coords.latitude
                && pinLocation.coords.longitude == searchLocation.coords.longitude){
                location = searchLocation.short_address
            }
        }
        
        return location
    }

    render(){
        
        const location = this.setLocation()

        return(
            <View style={styles.container}>
                <Text adjustsFontSizeToFit >{location}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        width: '100%',
        height: '6%',
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        justifyContent:'center'
    },
    locationText:{
        fontSize: width * 0.04
    }
})