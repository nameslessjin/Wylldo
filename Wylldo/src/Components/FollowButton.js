import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Fire from '../firebase/Fire'

export default class FollowButton extends React.Component{


    state = {
        followButton: 'Follow',
        followData: {},
        self: false
    }

    componentDidMount(){
        this.checkFollow().then(data => {
            this.setState({followData:data})
        })

        if (this.props.userId == Fire.uid){
            this.setState({host: true})
        }

    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.followData != this.state.followData){
            if (this.state.followData){
                this.setState({followButton: 'Followed'})
            }
        }
    }

    checkSelf = () => {
        if (this.props.userId == Fire.uid){
            return true
        }
    }

    checkFollow = async() => {
        const followData = await Fire.checkFollow(this.props.userId)
        return followData
    }

    onFollow = async() => {
        const followData = await Fire.onFollowUser(this.props.userId, this.props.currentUserAvatar, this.props.otherUserAvatar)
        return followData
    }

    onUnFollow = () => {
        Fire.onUnfollowUser(this.props.userId, this.state.followData.followId)
    }

    onFollowBtnPressed = () => {
        if (this.state.followButton == 'Follow'){
            this.onFollow().then(data => {
                this.setState({followData: data})
                this.setState({followButton: 'Followed'})
            })
        } else {
            this.onUnFollow()
            this.setState({followButton: 'Follow'})
        }

    }



    render(){
        followBtn = (this.checkSelf()) ? (
                        <View style={[styles.btnStyle, styles.selfBtnStyle]}>
                            <Text style={[styles.textStyle, styles.selfText]}>Me</Text>
                        </View>
        )
                    : (
                        <TouchableOpacity 
                        style={[styles.btnStyle, 
                            (this.state.followButton == 'Follow') ? styles.followBtnStyle : styles.followedBtnStyle]} 
                        onPress={this.onFollowBtnPressed}>
                            <Text 
                            style={[styles.textStyle, 
                                (this.state.followButton == 'Follow') ? styles.followText : styles.followedText]} 
                            >{this.state.followButton}</Text>
                        </TouchableOpacity>

                    )
        
        return (
            <View>
                {followBtn}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    btnStyle:{
        width: 80,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    followBtnStyle:{
        height: 45,
        backgroundColor: '#FE4C4C',
    },
    followedBtnStyle:{
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#FE4C4C'
    },
    selfBtnStyle:{
        height: 45,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black'
    },
    textStyle:{
        fontSize: 16,
        fontFamily: 'ArialRoundedMTBold',
    },
    followText:{
        color: 'white'
    },
    followedText:{
        color: '#FE4C4C'
    },

    selfText:{
        color: 'black'
    }   
})