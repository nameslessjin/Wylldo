import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Platform} from 'react-native'
import Fire from '../firebase/Fire'
import ListUsers from '../Components/ListUsers'
import {connect} from 'react-redux'


class UserSearch extends React.Component{
    static get options(){
        return {
            topbar:{
                title:{
                    text: 'Search Users',
                    alignment: 'center'
                }
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        }
    }

    state={
        searchText: '',
        userList: null,
        focus: false,
        loading: false,
        searchStartAt: null,
        userList: []
    }

    _onFocus = () => {
        this.setState({focus: true})
    }

    _onBlur = () => {
        this.setState({focus: false})
    }

    _onSearchPress = () => {
        this.setState({focus: false})
        Keyboard.dismiss()
        const {searchText} = this.state
        this.searchUser(searchText).then(userList => {
            this.setState({userList: userList})
        })

    }

    searchUser = async (searchText, searchStartAt) => {
        this.setState({loading: true})
        const {userList, start} = await Fire.searchUser({searchText: searchText.trim(), start: searchStartAt})
        this.setState({loading: false, searchStartAt: start})
        // console.log(userList)
        return userList

    }

    _loadMore = () => {
        this.setState({loading: true})
        const {searchStartAt, searchText} = this.state
        if (searchStartAt){
            this.searchUser(searchText, searchStartAt).then(userList => {
                const updateUserList = [...this.state.userList].concat(userList)
                this.setState({userList: updateUserList})
            })
            .catch( err => console.error(err))
        }
        this.setState({loading: false})
    }

    _onUserListPress =() => {
        this.setState({focus:false})
        Keyboard.dismiss()
    }


    render(){

        const {focus, userList, searchText} = this.state
        const {componentId, following_list} = this.props

        let searchBtn = (searchText.trim().length >= 2) ? (
            <TouchableOpacity style={styles.searchBtn} onPress={this._onSearchPress} >
                <Text adjustsFontSizeToFit style={styles.searchBtnText} >Search</Text>
            </TouchableOpacity>
        ) : (
            <View style={styles.searchBtn}>
                <Text adjustsFontSizeToFit style={[styles.searchBtnText, {color: 'grey'}]} >Search</Text>
            </View>
        )

        return(
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <View style={[styles.searchTextContainer,
                                    (focus) ? styles.searchTextContainerOnFocus : null ]} >
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search people you want to know"
                            onChangeText={searchText => this.setState({searchText: searchText})}
                            onFocus={this._onFocus}
                            onBlur={this._onBlur}
                            maxLength={22}
                            autoCapitalize={'none'}
                        />
                    </View>
                    {searchBtn}
                </View>
                <TouchableWithoutFeedback onPress={this._onUserListPress}>
                    <View style={styles.userListContainer}>
                        <ListUsers
                            componentId = {componentId}
                            userList = {userList}
                            currentUser_following_list = {following_list}
                            onEndReached = {this._loadMore}
                            onEndReachedThreshold = {0.5}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

export default connect(null)(UserSearch)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    textInput:{
        height: '100%',
        width: '100%',
        paddingHorizontal: 15,
    },
    searchTextContainer:{
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        width: '90%',
        height: '100%',
        borderColor: 'grey'
    },
    searchTextContainerOnFocus:{
        borderColor: '#0481fe',
    },
    searchContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: (Platform.OS=='ios') ? '5%' : '8%',
        width: '90%',
        top: '2%',
    }, 
    searchBtn:{
        marginLeft: 5,
    },
    searchBtnText:{
        color: '#0481fe'
    },
    userListContainer:{
        top: '2%',
        height: '95%',
        width: '92%',
    }
})