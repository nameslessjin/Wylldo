import React from 'react'
import {StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import EventOption from './EventOption'
import Fire from '../firebase/Fire'
import { Navigation } from 'react-native-navigation';

export default class Header extends React.Component{

    state = {
        isOptionVisible: false
    }

    differenceOnTime = (timestamp) => {
        const nowTime = Date.now()
        const differenceInSec = Math.round((nowTime - timestamp) / 1000)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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
            let minutesAgo = minutes.toString() + " mins ago"
            if (minutes == 1){
                minutesAgo = "1 min ago"
            }
            return minutesAgo
        }

        //if grater then 1 second put seconds on it
        else if (differenceInSec >= 1){
            let secondsAgo = differenceInSec.toString() + " secs ago"
            if (differenceInSec == 1){
                secondsAgo = "1 sec ago "
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

    iconColor = () => {
        switch (this.props.tag) {
            case 'md-beer':
                return styles.beerIcon

            case 'md-american-football':
                return styles.footBall
            case 'md-book':
                return styles.book
        }
    }

    iconText = () => {
        const {tag} = this.props
        switch(tag){
            case 'md-beer':
                return 'Fun'
            case 'md-american-football':
                return 'Sport'
            case 'md-book':
                return 'Study'
        }
    }

    onUserPressed = async() => {
        const {componentId, hostUserId} = this.props
        const userData = await Fire.getUserData(hostUserId)
        Navigation.push(componentId, {
            component:{
                name: 'OtherProfile',
                passProps:{
                    ...userData
                }
            }
        })
    }

    render(){
        let createdTime = 'Now'
        if (this.differenceOnTime(this.props.timestamp)){
            createdTime = this.differenceOnTime(this.props.timestamp)
        }

        // let optionButton = null
        // if (Fire.uid == this.props.hostUserId){
        //     optionButton = (
        //         <TouchableOpacity style={styles.optionsTouchBar} onPress={this.setEventOption}>
        //             <Icon name={"md-more"} size={20} style={{marginRight: 13}} />
        //         </TouchableOpacity>
        //     )
        // }

        const optionButton = (
                <TouchableOpacity style={styles.optionsTouchBar} onPress={this.setEventOption}>
                    <Icon name={"md-more"} size={20} style={{marginRight: 13}} />
                </TouchableOpacity>
        )

        return(
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.onUserPressed}>
                    <View style={styles.row}>
                        <Image
                            style={styles.userProfilePic}
                            source={this.props.hostAvatar}
                        />
                        <Text style={styles.usernameStyle}>{this.props.hostUsername}</Text>
                        <View style={styles.icon}>
                            <Icon 
                                name={this.props.tag} 
                                size={18} 
                                style={[ 
                                    this.iconColor()
                                ]}
                            />
                            <Text style={[styles.iconText, this.iconColor()]}>
                                {this.iconText()}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.row}>
                    <Text style={styles.dateText}>{createdTime}</Text>
                    {optionButton}
                    <EventOption
                    isOptionVisible={this.state.isOptionVisible}
                    hostUserId= {this.props.hostUserId}
                    componentId = {this.props.componentId}
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
    icon:{
        marginLeft: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconText:{
        fontSize: 9
    },
    beerIcon:{
        color: 'orange'
    },
    footBall:{
        color: 'brown'
    },
    book:{
        color: 'green'
    },
    optionsTouchBar:{
        height: '85%',
        width: 25,
        alignItems: 'center',
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 14
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
        marginRight: 12,
        fontSize: 14
    },
})