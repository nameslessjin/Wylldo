import React from 'react'
import { View, Text, FlatList, StyleSheet, Alert} from 'react-native'
import InviteUserItem from '../Components/InviteUserItem'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'

export default class userInvite extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: ''
                },
                rightButtons:[
                    {
                        id: 'Invite',
                        text: 'Invite',
                        color: '#0481fe',
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
            loading: false,
            searchStartAt: null,
            userList: [],
            selectedUserList:[]
        }
    }

    componentDidMount(){
        this.getFollowerUsers('Follower', null)
        .then(result => {
            const {userList, searchStartAt} = result
            this.setState({userList: userList, searchStartAt: searchStartAt})
        })
        .catch(err => console.error(err))
    }

    navigationButtonPressed({buttonId}){
        if (buttonId == 'Invite'){
            const {selectedUserList} = this.state
            if (selectedUserList.length == 0){
                Alert.alert(
                    'Select users to invite',
                    '',
                    [
                        {
                            text: 'Close',
                            style: 'cancel'
                        }
                    ]
                )
            } else {
                const {componentId, eventId} = this.props
                this.onInviteUser(eventId, selectedUserList).then(() => {
                    Alert.alert(
                        'User invited',
                        '',
                        [
                            {
                                text: 'Ok',
                                style: 'cancel',
                                onPress: () => Navigation.pop(componentId)
                            }
                        ]
                    )
                })
            }
        }
    }

    onInviteUser = async(eventId, inviteUserList) => {
        await Fire.inviteUser(eventId, inviteUserList)
    }

    _onLoadMore = () => {
        this.setState({loading: true})
        const {searchStartAt} = this.state
        if (searchStartAt){
            this.getFollowerUsers('Follower', searchStartAt).then(result => {
                const {userList, searchStartAt} = result
                const updateUserList = [...this.state.userList].concat(userList)
                this.setState({userList: updateUserList, searchStartAt: searchStartAt, loading: false})
            })
            .catch(err => {
                console.error(err)
                this.setState({loading: false})
            })
        }
    }

    getFollowerUsers = async(type, searchStartAt) => {
        const {follower_list} = this.props
        const size = 7
        const {userList, start} = await Fire.getUsers({size: size, start: searchStartAt, userIdList: follower_list, type: type})
        return {userList: userList, searchStartAt: start}

    }

    _onSelectUser = (selectUserId) => {
        const {selectedUserList} = this.state
        const updateSlectedUserList = [...selectedUserList].concat([selectUserId])
        this.setState({selectedUserList: updateSlectedUserList})
    }

    _onDeselectUser = (deselectUserId) => {
        const {selectedUserList} = this.state
        const updateSlectedUserList = [...selectedUserList].filter(userId => userId != deselectUserId)
        this.setState({selectedUserList: updateSlectedUserList})
    }

    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <InviteUserItem 
                                {...item} 
                                onSelectUser={userId => this._onSelectUser(userId)} 
                                onDeselectUser = {userId => this._onDeselectUser(userId)}
                                />

    render(){
        const {userList} = this.state
        console.log(this.state.selectedUserList)
        return(
            <View style={styles.container}>
                <Text style={styles.FollowerText}>Followers</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={userList}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    onEndReached = {this._onLoadMore}
                    onEndReachedThreshold = {0}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginVertical: 10,
    },
    FollowerText:{
        color: 'grey',
        fontSize: 18,
        fontFamily: 'ArialRoundedMTBold',
        marginLeft: 10,
        marginVertical: 10
    }
})