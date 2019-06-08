import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'

export default class ProfileEventDisplay extends React.Component{

    differenceOnTime = (timestamp) => {
        const nowTime = Date.now()
        const differenceInSec = Math.round((nowTime - timestamp) / 1000)
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const initDate = new Date(timestamp)
        const createdDate = initDate.getDate()
        const createdMonth = months[initDate.getMonth()]
        const createdYear = initDate.getFullYear()
        const currentYear = (new Date(nowTime)).getFullYear()
        //if it is not the same year
        if (currentYear > createdYear){
            returnDate = createdMonth + " " + createdDate + " " + createdYear
            return returnDate
        }
        //if greater then 7 days put date on it
        if (differenceInSec > 604800){
            returnDate = createdMonth + " " + createdDate
            return returnDate
        } 
        // if greater then 1 days put how many days on it
        else if (differenceInSec > 86400) {
            const days = Math.floor((differenceInSec / 86400))
            let daysAgo = days.toString() + " days ago"
            if (days == 1){
                daysAgo = "1 day ago"
            }
            return daysAgo
        }
        // if greater then 1 hour put hours on it
        else if (differenceInSec > 3600){
            const hours = Math.floor((differenceInSec / 3600))
            let hoursAgo = hours.toString() + " hours ago"
            if (hours == 1){
                hoursAgo = "1 hour ago"
            }
            return hoursAgo
        }

        //if greater then 1 minute put minutes on it
        else if (differenceInSec > 60){
            const minutes = Math.floor((differenceInSec / 60))
            let minutesAgo = minutes.toString() + " minutes ago"
            if (minutes == 1){
                minutesAgo = "1 minute ago"
            }
            return minutesAgo
        }

        //if grater then 1 second put seconds on it
        else if (differenceInSec >= 1){
            let secondsAgo = differenceInSec.toString() + " seconds ago"
            if (differenceInSec == 1){
                secondsAgo = "1 second ago "
            }
            return secondsAgo
        }
    }

    eventStartTime = () => {
        let startTime = null
        if (this.props.startTime.seconds){
            startTime = new Date(this.props.startTime.seconds * 1000)
        }
        const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const date = startTime.getDate().toString()
        const month = monthList[startTime.getMonth()]
        let startHours = startTime.getHours()
        let startMinutes = startTime.getMinutes()
        let startAM = "AM"
        if (startMinutes < 10) {
            startMinutes = "0" + startMinutes
        }
        if (startHours > 12){
            startHours = startHours -12
            startAM = "PM"
        }
        const time = month + ' ' + date + ' ' + startHours + ':' + startMinutes + startAM

        return time
    }


    onEventPressed = () => {
        console.log(this.props.componentId)
        Navigation.push(this.props.componentId, {
            component: {
                name: 'SingleEvent',
                passProps:{
                    ...this.props,
                }
            }
        })
    }

    

    render(){

        
        let displayTime = 'Now'
        if (this.props.type == 'Joined'){
            displayTime = this.eventStartTime()
        } else {
            displayTime = this.differenceOnTime(this.props.timestamp)
        }

        
        
        const displayImage = (this.props.resizedImage) ? 
            <View style={styles.imageContainer}>
                <Image source={this.props.resizedImage} style={styles.image} resizeMode='cover' />
            </View>
            : null
        

        return(
            <TouchableOpacity style={styles.container} onPress={this.onEventPressed}>
                {displayImage}
                <View style={{flex: 1}}>
                    <View style={styles.header}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.row}>{this.props.hostUsername}</Text>
                            <Icon style={styles.row} name={this.props.tag} size= {20} />
                        </View>
                        <Text style={styles.dateText}>{displayTime}</Text>
                    </View>
                    <Text ellipsizeMode={"tail"} numberOfLines={2}>{this.props.description}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        marginBottom: 10
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row:{
        marginRight: 5
    },
    dateText:{
        color: 'grey',
        marginHorizontal: 15
    },
    image:{
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    imageContainer:{
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        width: 80,
        borderRadius: 20,
        marginRight: 10
        
    }
})