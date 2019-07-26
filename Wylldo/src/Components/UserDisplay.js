import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import FollowButton from './FollowButton'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {SwipeRow} from 'react-native-swipe-list-view'
import {loadJoinedUser, updateJoinedUserEvent} from '../store/actions/action.index'

class UserDisplay extends React.Component{

    onUserPress = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'OtherProfile',
                passProps:{
                    ...this.props,
                }
            }
        })
    }

    onRemoveJoinedUser = async() => {
        const {userId, eventId} = this.props
        const removeUserResult = await Fire.onRemoveJoinedUser(eventId, userId)
        if(removeUserResult){
            const {joinUserIds} = removeUserResult
            this.props.onUpdateJoinedUser(joinUserIds)
            const updateInfo = {
                eventId: eventId,
                joinUserIds: joinUserIds
            }
            this.props.onUpdateJoinedUserEvent(updateInfo)

            const passToJoinBtn = {
                joinedNum: joinUserIds.length + 1,
                join_userIDs: joinUserIds
            }
            this.props.onRemoveJoinedUser(passToJoinBtn)
        }
    }


    render(){
        const userProfilePic = (this.props.userId == Fire.uid) ?  
        (
            <View style={styles.row} onPress={this.onUserPress}>
                <Image source={this.props.avatarUri} style={styles.imageStyle}/>
                <Text style={styles.usernameStyle}>{this.props.username}</Text>
            </View>
        )
        :
        (
            <TouchableOpacity style={styles.row} onPress={this.onUserPress}>
                <Image source={this.props.avatarUri} style={styles.imageStyle}/>
                <Text style={styles.usernameStyle}>{this.props.username}</Text>
            </TouchableOpacity>
        )

        const hostDisplay = (
            <View style={styles.detailContainer}>
                {userProfilePic}
                <FollowButton 
                    userId={this.props.userId} 
                    following_list={this.props.currentUser.following_list}
                />
            </View>
        )

        const participantDisplay = (
            <SwipeRow disableLeftSwipe={true} leftOpenValue={75}>
                <TouchableOpacity style={styles.rowBackOptions} onPress={this.onRemoveJoinedUser}>
                        <Text style={styles.optionTextStyle}>REMOVE</Text>
                </TouchableOpacity>
                <View style={styles.detailContainer}>
                    {userProfilePic}
                    <FollowButton 
                        userId={this.props.userId} 
                        following_list={this.props.currentUser.following_list}
                    />
                </View>
            </SwipeRow>
        )

        const userDisplay = (this.props.userId == Fire.uid) ? (hostDisplay) : (participantDisplay)

        return(
            <View style={styles.container}>
                {userDisplay}
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
        onUpdateJoinedUser: (joinedUser) => dispatch(loadJoinedUser(joinedUser)),
        onUpdateJoinedUserEvent: (updateInfo) => dispatch(updateJoinedUserEvent(updateInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDisplay)


const styles = StyleSheet.create({
    container:{
        height: 80,
        width: "100%",
        backgroundColor: 'white',
        marginTop: 10
    },
    detailContainer:{
        flexDirection: 'row',
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    rowBackOptions:{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        paddingLeft: 7,
        height: '100%'
    },
    optionTextStyle:{
        fontSize: 14,
        fontFamily: 'ArialRoundedMTBold',
        color: 'white'
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