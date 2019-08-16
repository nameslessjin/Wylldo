import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from 'react-native'
import UniProfileHistory from './UniProfileHistory';
import {Navigation} from 'react-native-navigation'
import ProfileFollowBtn from './ProfileFollowBtn'
import UserSearchBtn from './UserSearchBtn'
import Fire from '../firebase/Fire'

const {height, width} = Dimensions.get('window')
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
            <Text adjustsFontSizeToFit style={styles.usernameText}>{username}</Text>
        )
        const followerDisplay = (
            <TouchableOpacity style={styles.followTouchBtn} onPress={this.onFollowerPressed}>
                <Text adjustsFontSizeToFit style={styles.followNum}>{followerNum}</Text>
                <Text adjustsFontSizeToFit style={styles.followText}>followers</Text>
            </TouchableOpacity>
        )
        const followingDisplay = (
            <TouchableOpacity style={styles.followTouchBtn} onPress={this.onFollowingPressed}>
                <Text adjustsFontSizeToFit style={styles.followNum}>{followingNum}</Text>
                <Text adjustsFontSizeToFit style={styles.followText}>following</Text>
            </TouchableOpacity>
        )

        
        const followOrSearch = (userId != Fire.uid)
            ? (<ProfileFollowBtn userId = {userId} following_list = {following_list}/>)
            : (<UserSearchBtn componentId={this.props.componentId} following_list={following_list} />)

        return(
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <View style={styles.followBtn}>
                        {followOrSearch}
                        {/* <ProfileFollowBtn
                            userId = {userId}
                            following_list = {following_list}
                        /> */}
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
        height: height*0.11,
        aspectRatio: 1,
        borderRadius: height*0.055,
        marginBottom: 10,
        marginTop: 15,
    },
    usernameText: {
        fontSize: height * 0.02
    },
    followTouchBtn:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        color: '#bdc3c7',
        fontSize: height * 0.018
    },
    followNum:{
        fontSize: height * 0.025,
    }, 
    followContainer:{
        width: '60%',
        height: '35%',
        borderRadius: 10,
        flexDirection: 'row'
    },

})