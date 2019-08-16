import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import ListUsers from '../Components/ListUsers'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'

SIZE = 7

class Follower extends React.Component{
    static get options(){
        return {
            topbar:{
                title:{
                    text: 'Follower',
                    alignment: 'center'
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
        this.state={
            userList:[],
            refreshing: false,
            loading: false,
            userId: this.props.userId,
            follower_list: this.props.follower_list
        }
    }

    componentDidMount(){
        this._onRefresh('Follower')

    }

    _onRefresh = (type) => this.getFollowerUsers(type).then(userList => {
        this.setState({userList:userList})
    })

    getFollowerUsers = async(type, startPosition) => {
        this.setState({refreshing: true})
        const {userList, start} = await Fire.getUsers({size: SIZE, start: startPosition, userIdList: this.state.follower_list, type: type})
        this.followingUsersStartPosition = start
        this.setState({refreshing: false, loading: false})
        return userList
    }

    _loadMore = () => {
        this.setState({loading: true})
        if (this.followingUsersStartPosition){
            this.getFollowerUsers('Following', this.followingUsersStartPosition).then(userList => {
                const updateUserList = this.state.userList.concat(userList)
                this.setState({userList: updateUserList})
            })
            .catch( error => console.log(error))
        }
        this.setState({refreshing: false, loading: false})
    }

    onShowFollowerUsers(){
        if (this.state.userList.length > 0){
            return (
                <View style={styles.userListContainer}>
                    <ListUsers
                        componentId = {this.props.componentId}
                        onEndReached = {this._loadMore}
                        onEndReachedThreshold = {0.5}
                        userList = {this.state.userList}
                        currentUser_following_list={this.props.following_list}
                    />
                </View>
            )
        } else{
            return (
                <View style={styles.textContainer}>
                    <Text adjustsFontSizeToFit style={styles.text}>Check what people will do and follow people you like!</Text>
                </View>
            )
        }
    }

    onLoadFollowerUsers = () => {
        if (this.state.loading && this.state.userList.length == 0){
            <View style={styles.textContainer}>
                <Text adjustsFontSizeToFit style={styles.text}>Loading...</Text>
            </View>
        } else {
            this.onShowFollowerUsers()
        }
    }


    render(){
        

        return(
            <View style={styles.container}>
                {
                    this.onShowFollowerUsers()
                }
            </View>
        )

    }
}

export default connect(null)(Follower)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text:{
        fontStyle: 'italic',
        color: 'grey',
        fontSize: 15,
        marginTop: 20
    },
    userListContainer:{
        flex: 1,
        width: '92%',
        marginTop: 10,
    },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: -30,
        marginHorizontal: 10
    },
})