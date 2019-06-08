import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import UniProfileHistory from './UniProfileHistory';
import PickAvatar from './PickAvatar'

export default class UniProfile extends React.Component {


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
            <TouchableOpacity style={styles.followTouchBtn}>
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
                <UniProfileHistory componentId={this.props.componentId} userId = {this.props.userId}/>
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
        height: 85,
        width: 85,
        borderRadius: 43,
        marginBottom: 10,
        marginTop: 20
    },
    usernameText: {
        fontSize: 16
    },
    followTouchBtn:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        color: '#bdc3c7',
        fontSize: 15
    },
    followNum:{
        fontSize: 18,
    }, 
    followContainer:{
        width: '60%',
        height: '35%',
        borderRadius: 10,
        flexDirection: 'row'
    },

})