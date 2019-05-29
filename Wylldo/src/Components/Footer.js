import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'

export default class Footer extends React.Component{


    state={
        heartPressed: false,
        likes: this.props.likes,
        joinBtn: 'JOIN'
    }

    componentDidMount(){
        this.checkUserLikeEvent()
        if (this.props.popUpWndLikes != null){
            this.setState({likes: this.props.popUpWndLikes, heartPressed: this.props.popUpWndHeartPressed})
        }
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

    onJoinBtnPressed = () => {
        if (this.checkJoinTime()){
            alert('Joined!')
        } else {
            alert('This event has expired')
        }
    }

    checkJoinTime = () =>{
        const currentTime = (new Date().getTime() / 1000)
        if (this.props.endTime.seconds <= currentTime){
            this.setState({joinBtn: 'EXPIRED'})
            return false
        }
        return true
    }

    render(){
        let locationBtn = null
        if (this.props.coords.latitude){
            locationBtn = (<TouchableOpacity onPress={() => this.onLocationBtnPressed()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#3498db'}}>Location</Text> 
                          </TouchableOpacity>)
                           
        } else{
            locationBtn = (<Text style={{fontSize: 15, fontWeight: 'bold', color: '#7f8c8d'}}>Location</Text>)
        }


        const heartBtn = <TouchableOpacity onPress={() => this.onHeartBtnPressed()}>
                            <Icon 
                                name={(this.state.heartPressed) ? 'md-heart' : 'md-heart-empty'} 
                                size={30}
                                color={(this.state.heartPressed) ? '#E91E63' : null}/>
                        </TouchableOpacity>

        const currentTime = (new Date().getTime() / 1000)
        let joinBtn = null
        if (this.props.endTime.seconds > currentTime){
            if (this.state.joinBtn == 'JOIN'){
                joinBtn = <TouchableOpacity style={styles.joinBtn} onPress={this.onJoinBtnPressed}>
                            <Text style={styles.joinTextStyle}>JOIN</Text>
                        </TouchableOpacity>
            }
        } else if (this.state.joinBtn == 'EXPIRED' || this.props.endTime.seconds <= currentTime) {
            joinBtn = <View style={styles.expireBtn}>
                        <Text style={styles.expireTextStyle}>EXPIRED</Text>
                    </View>
        }


        return(
            <View style={{backgroundColor: 'white', margin: 10}}>
                <View style={styles.timeLocationContainer}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', marginEnd: 5}}>Thur Apr 2 13:00</Text>
                    {locationBtn}
                </View>

                <View style={styles.buttonsContainer}>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        {heartBtn}
                        <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.state.likes}</Text>
                        <Icon name={'md-share-alt'} size={30} />
                    </View>
                    <View style={{alignItems: 'center', width: '22%', marginTop: 5}}>
                        {joinBtn}
                        <Text style={styles.countStyle}>{this.props.joinedNum}/{this.props.inviteCount}</Text>
                    </View>
                </View>

                <View>
                    <Text style={styles.name}>{this.props.hostUsername}</Text>
                    <Text style={styles.comment}>{this.props.description}</Text>
                    <Text style={styles.name}>Shawn</Text>
                    <Text style={styles.comment}>Jinsen is the best</Text>
                    <Text style={styles.name}>Wei</Text>
                    <Text style={styles.comment}>Zack is bad dog</Text>
                    <Text style={{color: 'grey', fontSize: 12}} >See {this.props.commentNum} more comments</Text>
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
        marginTop: -13
    },
    buttonsContainer:{
        height: '30%',
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10
    },
    joinBtn:{
        backgroundColor: '#FE4C4C',
        borderRadius: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expireBtn:{
        backgroundColor: 'grey',
        borderRadius: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countStyle:{
        fontSize: 15,
        color:'grey'
    },
    joinTextStyle:{
        fontSize: 20, 
        color:'white',
        fontFamily: 'ArialRoundedMTBold',
    },
    expireTextStyle:{
        fontSize: 15, 
        color:'white',
        fontFamily: 'ArialRoundedMTBold',
    }

})