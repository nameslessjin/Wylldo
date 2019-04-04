import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'

export default class Footer extends React.Component{

    onLocationBtnPressed = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ShowMap',
                passProps:{
                    ...this.props
                }
            }
        })
    }


    render(){
        let locationBtn = null
        if (this.props.coords.latitude){
            locationBtn = <TouchableOpacity onPress={() => this.onLocationBtnPressed()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#3498db'}}>Location</Text> 
                          </TouchableOpacity>
                           
        } else{
            locationBtn = <Text style={{fontSize: 15, fontWeight: 'bold', color: '#7f8c8d'}}>Location</Text> 
        }


        return(
            <View style={{backgroundColor: 'white', margin: 10}}>
                <View style={styles.timeLocationContainer}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Thur Apr 2 13:00</Text>
                    {locationBtn}
                </View>
                <View style={styles.buttonsContainer}>

                </View>
                <View>
                    <Text style={styles.name}>{this.props.name}</Text>
                    <Text style={styles.comment}>{this.props.description}</Text>
                    <Text style={styles.name}>Shawn</Text>
                    <Text style={styles.comment}>Jinsen is the best</Text>
                    <Text style={{color: 'grey', fontSize: 12}} >See 5000 more comments</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    name:{
        fontSize: 13,
        fontWeight: 'bold'
    },
    comment:{
        fontSize: 14,
    },
    timeLocationContainer:{
        height: 40,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -13
    },
    buttonsContainer:{
        height: 40,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }

})