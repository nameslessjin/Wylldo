import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {onFollow} from '../store/actions/action.index'

class FollowButton extends React.Component{


    state = {
        followButton: 'Follow',
        self: false,
    }

    componentDidMount(){
        this.checkFollow()
        if (this.props.userId == Fire.uid){
            this.setState({host: true})
        }
    }

    checkSelf = () => {
        if (this.props.userId == Fire.uid){
            return true
        }
    }

    checkFollow = () => {
        if (this.props.following_list.find(userId => userId === this.props.userId)) {
            this.setState({followButton: 'Followed'})
        }
    }

    onFollow = async() => {
        const result = await Fire.onFollowUser(this.props.userId)
        let update_following_list = [...this.props.currentUser.following_list]
        update_following_list.push(this.props.userId)
        const update_currentUser = {
            ...this.props.currentUser,
            following_list: update_following_list,
            followingNum: update_following_list.length
        }
        this.props.onFollow(update_currentUser)
        return result
    }

    onUnFollow = () => {
        Fire.onUnfollowUser(this.props.userId)
        let update_following_list = [...this.props.currentUser.following_list]
        update_following_list = update_following_list.filter(userId => userId != this.props.userId)
        console.log(update_following_list)
        const update_currentUser = {
            ...this.props.currentUser,
            following_list: update_following_list,
            followingNum: update_following_list.length
        }
        this.props.onFollow(update_currentUser)
    }

    onFollowBtnPressed = () => {
        if (this.state.followButton == 'Follow'){
            this.onFollow().then(result => {
                if (result == true){
                    this.setState({followButton: 'Followed'})
                }
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

const mapStateToProps = (state) => {
    return{
        currentUser: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onFollow: (user) => dispatch(onFollow(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton)

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