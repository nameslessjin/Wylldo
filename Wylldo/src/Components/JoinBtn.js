import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {deleteEvent} from '../store/actions/action.index'
import Icon from 'react-native-vector-icons/Ionicons'

const {height, width} = Dimensions.get('window')
class JoinBtn extends React.Component{

    state ={
        joinBtn: 'JOIN',
        joinedNum: this.props.joinedNum,
        join_userIDs: this.props.join_userIDs,
        isCompleted: this.props.isCompleted
    }

    componentDidMount(){

        this.checkUserOnEvent()
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps != this.props){
            this.setState({joinedNum: this.props.joinedNum, join_userIDs: this.props.join_userIDs})
            this.checkUserOnEvent()
        }
    }

    checkUserOnEvent = () => {

        if (this.props.join_userIDs.find(userId => userId === Fire.uid)){
            this.setState({joinBtn: 'VIEW'})
        } else if (this.state.joinedNum == this.props.inviteCount) {
            this.setState({joinBtn: 'FULL'})
        } else {
            this.setState({joinBtn: 'JOIN'})
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
                        alert('This event is full')
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
                    //There is problem with this.props/this.state join_userIDs
                    join_userIDs: this.state.join_userIDs,
                    hostUserId: this.props.hostUserId,
                    isCompleted: this.state.isCompleted,
                    follower_list: this.props.currentUser.follower_list,
                    onCancel: (res) => {
                        if (res.joinedNum != 0){
                            this.setState({joinedNum: res.joinedNum, join_userIDs: res.join_userIDs, joinBtn: 'JOIN'})
                        }
                    },
                    onRemoveJoinedUser: (res) => {
                        if (res.joinedNum != 0){
                            this.setState({joinedNum: res.joinedNum, join_userIDs: res.join_userIDs})
                        }
                    },
                    onComplete: () => {
                        this.setState({isCompleted: true})
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

        const {joinedNum} = this.state
        const {inviteCount} = this.props

        const viewBtn = <TouchableOpacity style={styles.joinBtn} onPress={this.onJoinBtnPressed}>
                            <Text adjustsFontSizeToFit style={styles.joinTextStyle}>VIEW</Text>
                        </TouchableOpacity>
        const expireBtn = <View style={styles.expireBtn}>
                            <Text adjustsFontSizeToFit style={styles.expireTextStyle}>EXPIRED</Text>
                        </View>
        const defaultJoinBtn = <TouchableOpacity style={styles.joinBtn} onPress={this.onJoinBtnPressed}>
                                <Text adjustsFontSizeToFit style={styles.joinTextStyle}>JOIN</Text>
                            </TouchableOpacity>
        const fullBtn = <View style={[styles.joinBtn, {backgroundColor: 'grey'}]}>
                            <Text adjustsFontSizeToFit style={styles.joinTextStyle}>FULL</Text>
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
                <View style={styles.participantContainer}>
                    <Icon
                        name={'md-contacts'}
                        size= {0.025 * height}
                        style={{color: (joinedNum < inviteCount) ? '#FE4C4C' : 'grey'}}
                    />
                    <Text adjustsFontSizeToFit style={styles.countStyle}>{joinedNum}/{inviteCount}</Text>
                </View>
            </View>
        )
     }

}

const mapStateToProps = (state) => {
    return{
        events: state.events.Events,
        currentUser: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onDeleteEvent: (eventId) => dispatch(deleteEvent(eventId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinBtn)

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
        marginLeft: 1,
        fontSize: 15,
        color:'grey'
    },
    joinTextStyle:{
        fontSize: 20, 
        color:'white',
        fontFamily: 'Jellee-Roman',
    },
    expireTextStyle:{
        fontSize: 14, 
        color:'white',
        fontFamily: 'Jellee-Roman',
    },
    participantContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    }
})