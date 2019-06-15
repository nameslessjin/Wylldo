import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import FollowButton from './FollowButton'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'

export default class UserDisplay extends React.Component{

    onUserPress = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'OtherProfile',
                passProps:{
                    ...this.props
                }
            }
        })
    }



    render(){
        const userProfilePic = (this.props.userId == Fire.uid) ?  
        (
            <View style={styles.row} onPress={this.onUserPress}>
                <Image source={this.props.avatarUri} style={styles.imageStyle}/>
                <Text style={styles.usernameStyle}>{this.props.name}</Text>
            </View>
        )
        :
        (
            <TouchableOpacity style={styles.row} onPress={this.onUserPress}>
                <Image source={this.props.avatarUri} style={styles.imageStyle}/>
                <Text style={styles.usernameStyle}>{this.props.name}</Text>
            </TouchableOpacity>
        )

        return(
            <View style={styles.container}>
                {userProfilePic}
                <FollowButton 
                    userId={this.props.userId} 
                    following_list={this.props.following_list}
                    />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: 80,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    imageStyle:{
        width: 70,
        height: 70,
        aspectRatio: 1,
        borderRadius: 34,
        marginRight: 10
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 15
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    followBtnStyle:{
        height: 40,
        width: 70,
        borderRadius: 25,
        backgroundColor: '#FE4C4C',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        fontFamily: 'ArialRoundedMTBold',
        fontSize: 16,
        color: 'white'
    }
})