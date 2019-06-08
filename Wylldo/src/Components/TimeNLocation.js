import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

export default class TimeNLocation extends React.Component {

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

    state = {
        time: null
    }

    timeFormat = () => {
        let startTime = null
        let endTime = null
        if(this.props.startTime.seconds){
             startTime = new Date(this.props.startTime.seconds * 1000)
             endTime = new Date(this.props.endTime.seconds * 1000)
        } else {
             startTime = new Date(this.props.startTime)
             endTime = new Date(this.props.endTime)
        }
        const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const dateInWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
        const date = startTime.getDate().toString()
        const day = dateInWeek[startTime.getDay()]
        const month = monthList[startTime.getMonth()]
        let startHours = startTime.getHours()
        let startMinutes = startTime.getMinutes()
        let endHours = endTime.getHours()
        let endMinutes = endTime.getMinutes()
        let startAM = "AM"
        let endAM = "AM"
        if (startMinutes < 10) {
            startMinutes = "0" + startMinutes
        }
        if (endMinutes < 10) {
            endMinutes = "0" + endMinutes
        }
        if (startHours > 12){
            startHours = startHours -12
            startAM = "PM"
        }
        if (endHours > 12){
            endHours = endHours -12
            endAM = "PM"
        }

        const timeFormat = day + ' ' + month + ' ' + date + ' ' + startHours + ":" + startMinutes + startAM 
                            + " - " + endHours + ":" + endMinutes + endAM
        
        return timeFormat
    }

    render(){

        const locationIcon = <Icon name='md-pin' size={25} />
        let locationBtn = null
        if (this.props.coords.latitude){
            locationBtn = (<TouchableOpacity onPress={() => this.onLocationBtnPressed()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#FE4C4C'}}>{locationIcon}</Text> 
                          </TouchableOpacity>)
                           
        } else{
            locationBtn = (<Text style={{fontSize: 15, fontWeight: 'bold', color: '#7f8c8d'}}>{locationIcon}</Text>)
        }


        return(
            <View style={styles.container}>
                <Text style={styles.timeText}>{this.timeFormat()}</Text>
                {locationBtn}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -13
    },
    timeText:{
        fontSize: 15, 
        fontWeight: 'bold', 
        marginEnd: 5
    },

})