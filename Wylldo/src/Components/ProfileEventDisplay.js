import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

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

    render(){

        return(
            <TouchableOpacity style={styles.container}>
                <View style={styles.header}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.row}>{this.props.hostUsername}</Text>
                        <Icon style={styles.row} name={this.props.tag} size= {20} />
                    </View>
                    <Text style={styles.dateText}>{this.differenceOnTime(this.props.timestamp)}</Text>
                </View>
                <Text>{this.props.description}</Text>
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        marginBottom: 5,
        borderRadius: 10,
        padding: 10
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    userProfilePic:{
        width: 30,
        height: 30,
        aspectRatio: 1,
        borderRadius: 20,
        marginHorizontal: 7,
        backgroundColor: 'green'
    },
    row:{
        marginRight: 5
    },
    dateText:{
        color: 'grey',
        marginRight: 12
    },
})