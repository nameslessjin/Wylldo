import React from 'react'
import {View, Text, StyleSheet, Alert, LayoutAnimation} from 'react-native'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'
import ListUsers from '../Components/ListUsers'
import {deleteEvent, loadJoinedUser} from '../store/actions/action.index'
import {connect} from 'react-redux'
import UserDisplay from '../Components/UserDisplay'

SIZE = 7

class JoinedUserList extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Who\'s going '
                },
                rightButtons:[
                    {
                        id: 'Options',
                        text: 'Options',
                        color: '#0481fe'
                    }
                ],
                backButton:{
                    showTitle: false
                }
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        }
    }

    constructor(props){
        super(props)
        Navigation.events().bindComponent(this)
        this.state = {
            refreshing: false,
            loading: false,
            join_userIDs: this.props.join_userIDs,
            userList: [],
            hostData: null,
        }
    }

    componentDidMount(){
        this._onRefresh('JOINED')
        this.getHostData(this.props.hostUserId).then(hostData => {
            this.setState({hostData: hostData})
        })
    }

    navigationButtonPressed({buttonId}){

        if (buttonId == 'Options'){
            this._onOptionPress()
        }
    }

    _onOptionPress = () => {
        const {hostUserId, isCompleted} = this.props
        const optionAlert = Alert.alert(
            'Options',
            '',
            (hostUserId == Fire.uid && !isCompleted) ?
            [
                {
                    text:  'Complete',
                    onPress: () => this._onCompletePress()
                },
                {
                    text: 'Invite',
                    onPress: () => this._onInvitePress()
                },
                {
                    text: 'Close',
                    onPress: () => this.onCancelPressed()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
            ]
            : 
            [
                {
                    text: 'Leave',
                    onPress: () => this.onCancelPressed()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
            ]
        )
    }

    _onCompletePress = () => {

        const completeAlert = Alert.alert(
            'Complete',
            'Complete this event to keep it from the public',
            [
                {
                    text: 'Confirm',
                    onPress: () => this.confirmComplete()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        )
    }

    _onInvitePress = () => {
        const {componentId, follower_list, eventId} = this.props
        Navigation.push(componentId, {
            component:{
                name: 'UserInvite',
                passProps:{
                    follower_list: follower_list,
                    componentId: componentId,
                    eventId: eventId
                }
            }
        })
        
    }

    onCancelPressed = () => {
        const cancelAlert = Alert.alert(
            'Cancel event',
            'Do you want leave this event?',
            [
                {
                    text: 'Confirm',
                    onPress: () => this.confirmCancel()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        )
    }

    _onRefresh = (type) => this.getJoinedUsers(type).then(userList => {
        this.setState({userList: userList})
        this.props.onLoadJoinedUser(userList)
    })

    getHostData = async (userId) => {
        const hostData = await Fire.getUserData(userId)
        return hostData
    }

    getJoinedUsers = async(type, startPosition) => {
        this.setState({refreshing: true})
        const {userList, start} = await Fire.getUsers({size: SIZE, start: startPosition, userIdList: this.props.join_userIDs, type: type})
        this.joinedUserStartPosition = start
        this.setState({refreshing: false, loading: false})

        return userList
    }

    _loadMore = () => {
        this.setState({loading: true})
        if (this.joinedUserStartPosition){
            this.getJoinedUsers('JOINED', this.joinedUserStartPosition).then(userList => {
                const updatedUserList = this.state.userList.concat(userList)
                this.setState({userList: updatedUserList})
                this.props.onLoadJoinedUser(updatedUserList)
            })
            .catch( error => console.log(error))
        }
        this.setState({refreshing: false, loading: false})
    }

    confirmComplete = () => {
        this.onCompleteEvent()
        this.props.onComplete()
    }

    confirmCancel = () => {

        if (this.props.hostUserId == Fire.uid){
            this.onDeleteEvent().then(deleteEventId => {
                this.props.onDeleteEvent(deleteEventId)
                const updatedJoin_userIDs = []
                const updatedJoinedNum = 0
                this.props.onCancel({joinedNum: updatedJoinedNum, join_userIDs: updatedJoin_userIDs})
                Navigation.pop(this.props.componentId)
            })
        } else {
            this.onCancelEvent().then(res => {
                const updatedJoin_userIDs = res.joinUserIds
                const updatedJoinedNum = res.joinNum
                if (res.joinNum == 0){
                    this.onDeleteEvent().then(deleteEvent => {
                        this.props.onDeleteEvent(deleteEvent)
                    })
                }
                this.props.onCancel({joinedNum: updatedJoinedNum, join_userIDs: updatedJoin_userIDs})
                Navigation.pop(this.props.componentId)
            })
        }
    }

    onCompleteEvent = async() => {
        await Fire.completeEvent(this.props.eventId)
    }

    onDeleteEvent = async() => {
        const deleteEventId = await Fire.deleteEvent(this.props.eventId)
        return deleteEventId
    }

    onCancelEvent = async() => {
        const cancelResult = await Fire.onCancelEvent(this.props.eventId)
        return cancelResult
    }

    render(){
        // console.log('JoinedUserList: props', this.props)
        // console.log('JoinedUserList: state ', this.state)
        LayoutAnimation.easeInEaseOut()
        const {componentId, currentUser, joinedUserList, hostUserId, eventId} = this.props
        const showList = (this.state.userList.length > 0) ?
                    <ListUsers
                        componentId={componentId}
                        onEndReached = {this._loadMore}
                        onEndReachedThreshold = {0.5}
                        userList = {joinedUserList}
                        currentUser_following_list = {currentUser.following_list}
                        eventId = {eventId}
                        hostUserId = {hostUserId}
                        onRemoveJoinedUser = {(updateInfo) => this.props.onRemoveJoinedUser(updateInfo)}
                    />
                    :
                    <View style={styles.textContainer}>
                        <Text adjustsFontSizeToFit style={styles.text}>No one has joined yet</Text>
                    </View>

        const showHost = (
                    <View>
                        <Text adjustsFontSizeToFit style={styles.hostText}>Host</Text>
                        <UserDisplay  
                            {...this.state.hostData} 
                            userId={hostUserId} 
                            componentId={componentId} 
                            currentUser_following_list = {currentUser.following_list}
                        />
                    </View>
        )

        return(
            <View style={styles.container}>
                <View style={styles.userListContainer}>
                    {showHost}
                    <View style={styles.breakLine}/>
                    {showList}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.events.currentUser,
        joinedUserList: state.events.joinedUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onDeleteEvent: (eventId) => dispatch(deleteEvent(eventId)),
        onLoadJoinedUser: (joinedUser) => dispatch(loadJoinedUser(joinedUser))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinedUserList)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userListContainer:{
        flex: 1,
        width: '92%',
        marginTop: 10,
    },
    text:{
        fontStyle: 'italic',
        color: 'grey',
        fontSize: 18,
        marginTop: 20
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: -30
    },
    hostText:{
        color: 'grey',
        fontSize: 18,
        fontFamily: 'Jellee-Roman',
    },
    breakLine:{
        borderBottomColor: "#DDDED1",
        borderBottomWidth: 2,
        width: '100%',
        marginBottom: 10
    }
})