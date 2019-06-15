import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import UniProfileHistory from './UniProfileHistory';
import PickAvatar from './PickAvatar'
import {Navigation} from 'react-native-navigation'

export default class UniProfile extends React.Component {

    onFollowingPressed = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'Following',
                passProps:{
                    userId: this.props.userId,
                    componentId: this.props.componentId,
                    following_list: this.props.following_list
                }
            }
        })
    }



    render(){
        const displayAvatar = (
            <Image source={this.props.avatarUri}  style={styles.avatar} />
        )
        const displayName = (
            <Text style={styles.usernameText}>{this.props.name}</Text>
        )
        const followerDisplay = (
            <TouchableOpacity style={styles.followTouchBtn}>
                <Text style={styles.followNum}>{this.props.followerNum}</Text>
                <Text style={styles.followText}>followers</Text>
            </TouchableOpacity>
        )
        const followingDisplay = (
            <TouchableOpacity style={styles.followTouchBtn} onPress={this.onFollowingPressed}>
                <Text style={styles.followNum}>{this.props.followingNum}</Text>
                <Text style={styles.followText}>following</Text>
            </TouchableOpacity>
        )

        return(
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    {displayAvatar}
                    {displayName}
                    <View style={styles.followContainer}>
                        {followerDisplay}
                        {followingDisplay}
                    </View>
                </View>
                <UniProfileHistory componentId={this.props.componentId} userId = {this.props.userId} />
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