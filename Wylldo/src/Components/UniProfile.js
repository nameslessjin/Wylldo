import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native'
import UniProfileHistory from './UniProfileHistory';
import {Navigation} from 'react-native-navigation'
import ProfileFollowBtn from './ProfileFollowBtn'

export default class UniProfile extends React.Component {

    onFollowingPressed = () => {
        const {componentId, userId, following_list} = this.props
        Navigation.push(componentId, {
            component:{
                name: 'Following',
                passProps:{
                    userId: userId,
                    componentId: componentId,
                    following_list: following_list
                }
            }
        })
    }

    onFollowerPressed = () => {
        const {componentId, userId, following_list, follower_list} = this.props
        Navigation.push(componentId, {
            component:{
                name: 'Follower',
                passProps:{
                    userId: userId,
                    componentId: componentId,
                    follower_list: follower_list,
                    following_list: following_list
                }
            }
        })
    }



    render(){
        const {avatarUri, username, followerNum, followingNum, componentId, userId, following_list} = this.props
        const displayAvatar = (
            <Image source={avatarUri}  style={styles.avatar} />
        )
        const displayName = (
            <Text style={styles.usernameText}>{username}</Text>
        )
        const followerDisplay = (
            <TouchableOpacity style={styles.followTouchBtn} onPress={this.onFollowerPressed}>
                <Text style={styles.followNum}>{followerNum}</Text>
                <Text style={styles.followText}>followers</Text>
            </TouchableOpacity>
        )
        const followingDisplay = (
            <TouchableOpacity style={styles.followTouchBtn} onPress={this.onFollowingPressed}>
                <Text style={styles.followNum}>{followingNum}</Text>
                <Text style={styles.followText}>following</Text>
            </TouchableOpacity>
        )
        return(
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <View style={styles.followBtn}>
                        <ProfileFollowBtn
                            userId = {userId}
                            following_list = {following_list}
                        />
                    </View>
                    {displayAvatar}
                    {displayName}
                    <View style={styles.followContainer}>
                        {followerDisplay}
                        {followingDisplay}
                    </View>
                </View>
                <UniProfileHistory componentId={componentId} userId = {userId} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#eee'
    },
    
    followBtn:{
        position: 'absolute',
        top: 10,
        right: 5
        
    },  
    userContainer:{
        width: '100%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    avatar:{
        height: 80,
        width: 80,
        borderRadius: 40,
        marginBottom: 10,
        marginTop: 15,
    },
    usernameText: {
        fontSize: 14
    },
    followTouchBtn:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        color: '#bdc3c7',
        fontSize: 14
    },
    followNum:{
        fontSize: 17,
    }, 
    followContainer:{
        width: '60%',
        height: '35%',
        borderRadius: 10,
        flexDirection: 'row'
    },

})