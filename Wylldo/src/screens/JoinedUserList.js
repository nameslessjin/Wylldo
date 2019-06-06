import React from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'
import ListUsers from '../Components/ListUsers'
import {deleteEvent} from '../store/actions/action.index'
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
                        id: 'Cancel',
                        text: 'Cancel',
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
            hostData: null
        }
    }

    componentDidMount(){
        this._onRefresh('JOINED')
        this.getHostData(this.props.hostUserId).then(hostData => {
            this.setState({hostData: hostData})
        })

    }

    navigationButtonPressed({buttonId}){
        if (buttonId == 'Cancel'){
            this.onCancelPressed()
        }
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
    })

    getHostData = async (userId) => {
        const hostData = await Fire.getUserData(userId)
        return hostData
    }

    getJoinedUsers = async(type, startPosition) => {
        this.setState({refreshing: true})
        const {userList, start} = await Fire.getUsers({size: SIZE, start: startPosition, userIdList: this.state.join_userIDs, type: type})
        this.joinedUserStartPosition = start
        this.setState({refreshing: false, loading: false})
        // console.log(userList)
        // console.log(start)
        return userList
    }

    _loadMore = () => {
        this.setState({loading: true})
        if (this.joinedUserStartPosition){
            this.getJoinedUsers('JOINED', this.startPosition).then(userList => {
                const updatedUserList = this.state.userList.concat(userList)
                this.setState({userList: updatedUserList})
            })
            .catch( error => console.log(error))
        }
        this.setState({refreshing: false, loading: false})
    }

    confirmCancel = () => {

        this.updatedJoin_userIDs = this.state.join_userIDs
        this.updatedJoinedNum = this.updatedJoin_userIDs.length
        if (this.props.hostUserId == Fire.uid){
            this.onDeleteEvent().then(deleteEventId => {
                this.props.onDeleteEvent(deleteEventId)
                this.updatedJoin_userIDs = []
                this.updatedJoinedNum = 0
            })
        } else {
            this.onCancelEvent().then(res => {
                this.updatedJoin_userIDs = res.joinUserIds
                this.updatedJoinedNum = res.joinNum
            })
        }

        const updatedJoin_userIDs = this.updatedJoin_userIDs
        const updatedJoinedNum = this.updatedJoinedNum
        this.props.onCancel({joinedNum: updatedJoinedNum, join_userIDs: updatedJoin_userIDs})
        Navigation.pop(this.props.componentId)
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
        const showList = (this.state.userList.length > 0) ?
                    <ListUsers
                    componentId={this.props.componentId}
                    onEndReached = {this._loadMore}
                    onEndReachedThreshold = {0.5}
                    userList = {this.state.userList}
                    />
                    :
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>No one has joined yet</Text>
                    </View>

        const showHost = (
                    <View>
                        <Text style={styles.hostText}>Host</Text>
                        <UserDisplay  {...this.state.hostData}/>
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
        currentUser: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onDeleteEvent: (eventId) => dispatch(deleteEvent(eventId))
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
        fontFamily: 'ArialRoundedMTBold',
    },
    breakLine:{
        borderBottomColor: "#DDDED1",
        borderBottomWidth: 2,
        width: '100%',
        marginBottom: 10
    }
})