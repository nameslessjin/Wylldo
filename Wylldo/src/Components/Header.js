import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import EventOption from './EventOption'


export default class Header extends React.Component{

    state = {
        isOptionVisible: false
    }

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

    setEventOption = () => {
        this.setState({isOptionVisible: true})
    }
    hideEventOption = () => {
        this.setState({isOptionVisible: false})
    }

    render(){
        let createdTime = 'Now'
        if (this.differenceOnTime(this.props.timestamp)){
            createdTime = this.differenceOnTime(this.props.timestamp)
        }
        
        return(
            <View style={styles.container}>
                <View style={styles.row}>
                    <Image
                        style={styles.userProfilePic}
                        source={this.props.hostAvatar}
                    />
                    <Text style={styles.usernameStyle}>{this.props.hostUsername}</Text>
                    <Icon name={this.props.tag} size={20} style={{marginLeft: 5}}/>
                </View>
                <View style={styles.row}>
                    <Text style={styles.dateText}>{createdTime}</Text>

                    <TouchableOpacity style={styles.optionsTouchBar} onPress={this.setEventOption}>
                        <Icon name={"md-more"} size={20} style={{marginRight: 13}} />
                    </TouchableOpacity>
                    <EventOption
                    isOptionVisible={this.state.isOptionVisible}
                    hostUserid= {this.props.hostUserid}
                    eventId = {this.props.eventId}
                    onBackdropPress={() => this.hideEventOption()}
                    />

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height: 55,
        width:  "100%",
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    optionsTouchBar:{
        height: '85%',
        width: 25,
        alignItems: 'center',
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 16
    },
    userProfilePic:{
        width: 42,
        height: 42,
        aspectRatio: 1,
        borderRadius: 20,
        marginHorizontal: 7
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText:{
        color: 'grey',
        marginRight: 12
    },
})