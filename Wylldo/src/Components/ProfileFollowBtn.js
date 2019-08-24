import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {onFollow} from '../store/actions/action.index'

const {height, width} = Dimensions.get('window')
class FollowButton extends React.Component{


    state = {
        followButton: 'Follow',
        self: false,
        following_list: this.props.currentUser.following_list
    }

    componentDidMount(){
        this.checkFollow()
        if (this.props.userId == Fire.uid){
            this.setState({self: true})
        }
    }


    checkSelf = () => {
        if (this.props.userId == Fire.uid){
            return true
        }
    }

    checkFollow = () => {
        if (this.props.currentUser.following_list.find(userId => userId === this.props.userId)) {
            this.setState({followButton: 'Followed'})
        } else {
            this.setState({followButton: 'Follow'})
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
        this.setState({following_list: update_following_list})
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
                    if(this.props.updateFollowBtn){
                        this.props.updateFollowBtn()
                    }
                }
            })
        } else {
            this.onUnFollow()
            this.setState({followButton: 'Follow'})
            if(this.props.updateFollowBtn){
                this.props.updateFollowBtn()
            }
        }

    }



    render(){
        followBtn = (this.state.self) ? (
                        <View style={[styles.btnStyle, styles.selfBtnStyle]}>
                            <Text adjustsFontSizeToFit style={[styles.textStyle, styles.selfText]}>Me</Text>
                        </View>
        )
                    : (
                        <TouchableOpacity 
                        style={[styles.btnStyle, 
                            (this.state.followButton == 'Follow') ? styles.followBtnStyle : styles.followedBtnStyle]} 
                        onPress={this.onFollowBtnPressed}>
                            <Text 
                            adjustsFontSizeToFit
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
        width: 0.09 * height,
        borderRadius: 0.027 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followBtnStyle:{
        height: 0.055 * height,
        backgroundColor: '#FE4C4C',
    },
    followedBtnStyle:{
        height: 0.055 * height,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#FE4C4C'
    },
    selfBtnStyle:{
        height: 0.055 * height,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black'
    },
    textStyle:{
        fontSize: 0.018 * height,
        fontFamily: 'Jellee-Roman',
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