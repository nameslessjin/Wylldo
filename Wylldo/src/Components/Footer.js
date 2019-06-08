import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import JoinBtn from './JoinBtn'
import TimeNLocation from './TimeNLocation'

export default class Footer extends React.Component{


    state={
        heartPressed: false,
        likes: this.props.likes,
    }

    componentDidMount(){
        this.checkUserOnEvent()
        if (this.props.popUpWndLikes != null){
            this.setState({likes: this.props.popUpWndLikes, heartPressed: this.props.popUpWndHeartPressed})
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps != this.props){
            this.setState({likes: this.props.likes})
            this.checkUserOnEvent()
        }
    }


    checkUserOnEvent = () => {
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

    render(){

        const heartBtn = <TouchableOpacity onPress={() => this.onHeartBtnPressed()}>
                            <Icon 
                                name={(this.state.heartPressed) ? 'md-heart' : 'md-heart-empty'} 
                                size={30}
                                color={(this.state.heartPressed) ? '#E91E63' : null}/>
                        </TouchableOpacity>


        return(
            <View style={{backgroundColor: 'white', margin: 10}}>

                <TimeNLocation {...this.props} componentId = {this.props.componentId} />

                <View style={styles.buttonsContainer}>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        {heartBtn}
                        <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.state.likes}</Text>
                        <Icon name={'md-share-alt'} size={30} />
                    </View>
                    <JoinBtn {...this.props} componentId = {this.props.componentId} />
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
    buttonsContainer:{
        height: '30%',
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10
    }
})