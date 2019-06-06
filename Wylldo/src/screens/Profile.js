import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, } from 'react-native'
import Fire from '../firebase/Fire'
import {Navigation} from 'react-native-navigation'
import PickAvatar from '../Components/PickAvatar';
import {connect} from 'react-redux'
import {updateUserdata,} from '../store/actions/action.index'
import ProfileHistory from '../Components/ProfileHistory'


class Profile extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text:'Profile',
                    alignment: 'center'
                },
                rightButtons:[
                    {
                        id: 'settingBtn',
                        text: 'Settings',
                        color: '0481fe'
                    }
                ],
            }
        }
    }

    constructor(props){
        super(props)
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({buttonId}){
        if(buttonId == "settingBtn"){
            Navigation.push(this.props.componentId, {
                component:{
                    name: 'Settings'
                }
            })
        }
    }

    updateAvatar = async(avatar) =>{
        const updateUserData = await Fire.updateUserInformation(this.props.currentUserData, avatar)
        return updateUserData
    }

    render(){
        const displayName = (
            <Text style={{fontSize: 16}}>{this.props.currentUserData.name}</Text>
        )
        const followerDisplay = (
            <TouchableOpacity style={styles.followTouchBtn}>
                <Text style={styles.followNum}>{this.props.currentUserData.followerNum}</Text>
                <Text style={styles.followText}>followers</Text>
            </TouchableOpacity>
        )
        const followingDisplay = (
            <TouchableOpacity style={styles.followTouchBtn}>
                <Text style={styles.followNum}>{this.props.currentUserData.followingNum}</Text>
                <Text style={styles.followText}>following</Text>
            </TouchableOpacity>
        )
        return(
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <PickAvatar avatarUri={this.props.currentUserData.avatarUri} updateAvatar={(updateAvat) => {
                        this.updateAvatar(updateAvat)
                        .then(updatedUserData => this.props.onUpdatedUserData(updatedUserData))}} />
                    {displayName}
                    <View style={styles.followContainer}>
                        {followerDisplay}
                        {followingDisplay}
                    </View>
                </View>
    
                <ProfileHistory componentId={this.props.componentId}/>

            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUserData: state.events.currentUser,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onUpdatedUserData: (updatedUserData) => dispatch(updateUserdata(updatedUserData)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

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
    historyContainer:{
        width: '100%',
        height: '70%',
        alignItems: 'center'
    },
    followContainer:{
        width: '60%',
        height: '35%',
        borderRadius: 10,
        flexDirection: 'row'
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
})