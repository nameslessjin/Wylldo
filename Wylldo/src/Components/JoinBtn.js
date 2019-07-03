import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {deleteEvent} from '../store/actions/action.index'

class JoinBtn extends React.Component{

    state ={
        joinBtn: 'JOIN',
        joinedNum: this.props.joinedNum,
        join_userIDs: this.props.join_userIDs
    }

    componentDidMount(){

        this.checkUserOnEvent()
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps != this.props){
            this.setState({joinedNum: this.props.joinedNum})
            this.checkUserOnEvent()
        }
    }

    componentWillMount(){
        
    }

    checkUserOnEvent = () => {
        if (this.state.joinedNum == this.props.inviteCount){
            this.setState({joinBtn: 'FULL'})
        }
        if (this.props.join_userIDs.find(userId => userId === Fire.uid)){
            this.setState({joinBtn: 'VIEW'})
        }
        if (this.props.hostUserId === Fire.uid){
            this.setState({joinBtn: 'VIEW'})
        }
    }

    onJoinBtnPressed = () => {
        if (this.checkJoinTime()){
            if (this.state.joinBtn == 'JOIN'){
                this.onJoinEvent(this.props.eventId).then(joinedResult => {
                    if(joinedResult.joinNum == 0){
                        alert('Event has been canceled')
                        this.props.onDeleteEvent(this.props.eventId)
                    }
                    else if (joinedResult.joinNum <= this.props.inviteCount){
                        this.setState({joinedNum: joinedResult.joinNum, joinBtn: 'VIEW', join_userIDs: joinedResult.joinUserIds})
                    } else {
                        this.setState({joinedNum: joinedResult.joinNum, joinBtn: 'FULL', join_userIDs: joinedResult.joinUserIds})
                    }
                })
            }
            else if (this.state.joinBtn == 'VIEW'){
                this.onViewBtnPressed()
            }
        } else {
            alert('This event has expired')
        }
    }

    onViewBtnPressed = () => {
        Navigation.push(this.props.componentId, {
            component:{
                name: 'JoinedUserList',
                passProps:{
                    eventId: this.props.eventId,
                    join_userIDs: this.state.join_userIDs,
                    hostUserId: this.props.hostUserId,
                    onCancel: (res) => {
                        if (res.joinedNum != 0){
                            this.setState({joinedNum: res.joinedNum, join_userIDs: res.join_userIDs, joinBtn: 'JOIN'})
                        }
                    }
                }
            }
        })
    }

    onJoinEvent = async (eventId) => {
        const joinResult = await Fire.onJoinEvent(eventId)
        return joinResult
     }
 
     checkJoinTime = () =>{
         const currentTime = (new Date().getTime() / 1000)
         if (this.props.endTime.seconds <= currentTime){
             this.setState({joinBtn: 'EXPIRED'})
             return false
         }
         return true
     }

     render(){

        const viewBtn = <TouchableOpacity style={styles.joinBtn} onPress={this.onJoinBtnPressed}>
                            <Text style={styles.joinTextStyle}>VIEW</Text>
                        </TouchableOpacity>
        const expireBtn = <View style={styles.expireBtn}>
                            <Text style={styles.expireTextStyle}>EXPIRED</Text>
                        </View>
        const defaultJoinBtn = <TouchableOpacity style={styles.joinBtn} onPress={this.onJoinBtnPressed}>
                                <Text style={styles.joinTextStyle}>JOIN</Text>
                            </TouchableOpacity>
        const fullBtn = <View style={[styles.joinBtn, {backgroundColor: 'grey'}]}>
                            <Text style={styles.joinTextStyle}>FULL</Text>
                        </View>

        const currentTime = (new Date().getTime() / 1000)
        let joinBtn = (this.state.joinBtn == 'VIEW') ? viewBtn : 
                        (this.state.joinBtn == 'FULL') ? fullBtn : defaultJoinBtn
        if (this.props.endTime.seconds > currentTime){
            if (this.state.joinBtn == 'JOIN'){
                joinBtn = defaultJoinBtn
            }
            else if (this.state.joinBtn == 'VIEW') {
                joinBtn = viewBtn
            }
            else if (this.state.joinBtn == 'FULL'){
                joinBtn = fullBtn
            }
        } else if (this.state.joinBtn == 'EXPIRED' || this.props.endTime.seconds <= currentTime) {
            joinBtn = expireBtn
        }


        return(
            <View style={styles.container}>
                {joinBtn}
                <Text style={styles.countStyle}>{this.state.joinedNum}/{this.props.inviteCount}</Text>
            </View>
        )
     }

}

const mapDispatchToProps = dispatch => {
    return{
        onDeleteEvent: (eventId) => dispatch(deleteEvent(eventId))
    }
}

export default connect(null, mapDispatchToProps)(JoinBtn)

const styles = StyleSheet.create({
    container:{
        alignItems: 'center', 
        width: '22%', 
        marginTop: 5
    },
    joinBtn:{
        backgroundColor: '#FE4C4C',
        borderRadius: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expireBtn:{
        backgroundColor: 'grey',
        borderRadius: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countStyle:{
        fontSize: 15,
        color:'grey'
    },
    joinTextStyle:{
        fontSize: 20, 
        color:'white',
        fontFamily: 'ArialRoundedMTBold',
    },
    expireTextStyle:{
        fontSize: 15, 
        color:'white',
        fontFamily: 'ArialRoundedMTBold',
    }
})