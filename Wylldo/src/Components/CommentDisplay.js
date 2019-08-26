import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Fire from '../firebase/Fire'
import EventOption from './EventOption'

// import {connect} from 'react-redux'

export default class CommentDisplay extends React.Component{

    state={
        isOptionVisible: false
    }


    setEventOption = () => {
        this.setState({isOptionVisible: true})
    }
    hideEventOption = () => {
        this.setState({isOptionVisible: false})
    }

    
    displayTime(){
        //The naming is messed up here.  The first comment is the description from event.  It uses "createdTime"
        //The other comments are independent.  They use "create_time"
        const {create_time} = this.props
        // console.log(createdTime)
        // console.log(create_time)
        const createdTime = (create_time) ? create_time : this.props.createdTime

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        try{
            const timestamp = new Date(createdTime.seconds * 1000)
            const now = Date.now()
            const differenceInSec = Math.round(now / 1000 - createdTime.seconds) 
            const createDate = timestamp.getDate()
            const createMonth = months[timestamp.getMonth()]
            const createYear = timestamp.getFullYear()
            const currentYear = (new Date(now)).getFullYear
        
            //if it is not the same year
            if (currentYear > createYear){
                const returnDate = createMonth + " " + createDate + " " + createYear
                return returnDate
            }
            //if greater then 7 days put date on it
            if (differenceInSec > 604800){
                const returnDate = createMonth + " " + createDate
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
     } catch{}
        
    }

    

    onUserPressed = async() => {
        const {componentId, user_id} = this.props
        const userData = await Fire.getUserData(user_id)
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
        const {comment, user_id, username, user_avatar, commentId} = this.props
        let optionButton = null
        if (commentId != 'description-for-this-wylldo') {
            optionButton = (
                <TouchableOpacity  onPress={this.setEventOption}>
                    <Icon name={"md-more"} size={20} style={{marginRight: 13}} />
                </TouchableOpacity>
            )
        } else {
            optionButton = null
        }
        
        return(
            <View style={styles.container}>
                <View style={[styles.row, styles.displayContainer]}>
                    <TouchableWithoutFeedback onPress={this.onUserPressed}>
                            <Image source={user_avatar} style={styles.imageStyle}/>
                    </TouchableWithoutFeedback>
                    <View style={ styles.textContainer}>
                        <View style={styles.row}>
                            <Text adjustsFontSizeToFit style={styles.usernameStyle}>{username}</Text>
                            <Text adjustsFontSizeToFit style={styles.timeStyle}>{this.displayTime()}</Text>
                        </View>
                        <View style={styles.commentContainer}>
                            <Text adjustsFontSizeToFit numberOfLines={10} style={styles.commentStyle}>{comment}</Text>
                        </View>
                    </View>
                    {optionButton}
                    <EventOption
                        isOptionVisible={this.state.isOptionVisible}
                        hostUserId= {this.props.user_id}
                        componentId = {this.props.componentId}
                        commentId = {commentId}
                        onBackdropPress={() => this.hideEventOption()}
                    />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    displayContainer:{
        alignItems: 'flex-start', 
        paddingTop: 10
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageStyle:{
        width: 50,
        height: 50,
        aspectRatio: 1,
        borderRadius: 25,
        marginRight: 10
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 14
    },
    timeStyle:{
        fontSize: 12,
        marginLeft: 10
    },
    commentStyle:{
        fontSize: 13,
        marginTop: 5,
    },
    textContainer:{
        flex: 1,
        paddingTop: 5
    },
    commentContainer:{
        width: '85%'
    }
})