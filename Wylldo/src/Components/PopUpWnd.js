import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'

const {height, width} = Dimensions.get('window')
export default class PopUpWnd extends React.Component{

    state={
        heartPressed: false,
        likes: this.props.likes
    }

    onWindowPressed = () => {
        this.props.onPress()
        Navigation.push(this.props.componentId, {
            component: {
                name: 'SingleEvent',
                passProps:{
                    ...this.props,
                    popUpWndLikes: this.state.likes,
                    popUpWndHeartPressed: this.state.heartPressed
                }
            }
        })
    }

    componentDidMount(){
        this.checkUserLikeEvent()
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps != this.props){
            this.setState({likes: this.props.likes})
            this.checkUserLikeEvent()
        }
    }

    checkUserLikeEvent = () => {
        if (this.props.like_userIDs.find(userId => userId === Fire.uid)){
            this.setState({heartPressed: true})
        } else{
            this.setState({heartPressed: false})
        }
    }


    onHeartBtnPressed = () => {

        let updatedLikes = this.state.likes
        if (this.state.heartPressed){
            updatedLikes = updatedLikes - 1
            this.setState({heartPressed: false, likes: updatedLikes})
            this.userUnlikeEvent(this.props.eventId)

        } else{
            updatedLikes = updatedLikes + 1
            this.setState({heartPressed: true, likes: updatedLikes})
            this.userLikeEvent(this.props.eventId)
        }

    }

    userLikeEvent = async (eventId) => {
        await Fire.onLikeEvent(eventId) 
    }
    userUnlikeEvent = async (eventId) => {
        await Fire.onUnlikeEvent(eventId)
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
                            + "-" + endHours + ":" + endMinutes + endAM
        
        return timeFormat
    }

    render(){
        const heartBtn = <TouchableOpacity onPress={() => this.onHeartBtnPressed()}>
                            <Icon 
                                name={(this.state.heartPressed) ? 'md-heart' : 'md-heart-empty'} 
                                size={30}
                                color={(this.state.heartPressed) ? '#E91E63' : null}/>
                        </TouchableOpacity>

        let displayImage = null

        if (this.props.image){
            displayImage= (
                <View style={styles.imageContainer}>
                    <Image source={this.props.image} resizeMode='cover' style={styles.image} />
                </View>
            )
        } else{
            displayImage = null
        }

        

        return(
            <View style={styles.container}>
                <View style={styles.displayContainer}>
                    {displayImage}
                    <View style={(displayImage) ? styles.informationContainer : styles.informationContainerNoImg}>
                        <TouchableOpacity style={{height: '80%'}} onPress={() => this.onWindowPressed()}>
                            <Text style={styles.timeStyle}>{this.timeFormat()}</Text>
                            <Text style={styles.name}>{this.props.hostUsername}</Text>
                            <Text 
                                ellipsizeMode={"tail"} 
                                numberOfLines={2} 
                                style={styles.comment}>
                                {this.props.description}
                            </Text>
                            <Text style={{color: 'grey', fontSize: 0.016 * height}} >See all {this.props.commentNum} comments</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            {heartBtn}
                            <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.state.likes}</Text>
                            {/* <Icon name={'md-share-alt'} size={30} /> */}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        width: "95%",
        height: "35%",
        backgroundColor: "white",
        borderRadius: 20,
        position: 'absolute',
        top: "64%",
        left: "2.5%" ,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeStyle:{
        fontSize: 13, 
        fontWeight: 'bold', 
        marginEnd: 5,
        marginBottom: 5
    },
    displayContainer:{
        width: "90%",
        height: '88%',
        flexDirection: 'row'
    },
    informationContainer:{
        height: '100%',
        width: '60%',
    },
    informationContainerNoImg:{
        height: '100%',
        width: '100%',
    },
    buttonContainer:{
        width: '100%',
        height: "20%",
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    imageContainer:{
        height: '100%',
        backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderRadius: 20,
        marginEnd: 9
    },
    image:{
        width: "100%",
        height:'100%',
        backgroundColor: '#D8D8D8',
        borderRadius: 20,
    },
    name:{
        fontSize: 12,
        fontWeight: 'bold'
    },
    comment:{
        fontSize: 13,
        marginBottom: 5
    },
})