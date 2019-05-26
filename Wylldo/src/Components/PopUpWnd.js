import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import Modal from 'react-native-modal'

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
                    stateLikes: this.state.likes,
                    stateHeartPressed: this.state.heartPressed
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
                            <Text style={{fontSize: 15, fontWeight: 'bold', marginEnd: 5}}>Thur Apr 2 13:00</Text>
                            <Text style={styles.name}>{this.props.hostUsername}</Text>
                            <Text ellipsizeMode={"tail"} numberOfLines={2}>{this.props.description}</Text>
                            <Text style={styles.name}>Shawn</Text>
                            <Text style={styles.comment} ellipsizeMode={"tail"} numberOfLines={1} >Jinsen is the best person in the world, no in the whole universe.  He is a god.</Text>
                            <Text style={styles.name}>Wei</Text>
                            <Text style={styles.comment} ellipsizeMode={"tail"} numberOfLines={1}>Zack is bad dog.  I have never seen a dog as bad as zack is.  He is just terrible</Text>
                            <Text style={{color: 'grey', fontSize: 12}} >See {this.props.commentNum} more comments</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            {heartBtn}
                            <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.state.likes}</Text>
                            <Icon name={'md-share-alt'} size={30} />
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
    displayContainer:{
        width: "90%",
        height: '87%',
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
        fontSize: 13,
        fontWeight: 'bold'
    },
    comment:{
        fontSize: 14,
    },
})