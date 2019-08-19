import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import Modal from 'react-native-modal'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {deleteEvent, deleteComment} from '../store/actions/action.index'
import {Navigation} from 'react-native-navigation'

class EventOption extends React.Component{

    state={
        isOptionVisible: false,
        pickerOpacity: 0.4,
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps != this.props){
            this.setState({isOptionVisible: this.props.isOptionVisible})
        }
    }

    onBackdropPress = () => {
        this.setState({isOptionVisible: false})
        this.props.onBackdropPress()
    }

    onDeletePress = () => {
        if (this.props.eventId){
            this.onDeleteEvent().then(deleteEventId => {
                this.props.onDeleteEvent(deleteEventId)
                Navigation.popToRoot(this.props.componentId)
    
            })
        }

        if (this.props.commentId){
            this.onDeleteComment().then(commentId => {
                this.props.onDeleteComment(commentId)
            })
        }
    }

    onDeleteEvent = async() => {
        const deleteEventId = await Fire.deleteEvent(this.props.eventId)
        return deleteEventId
    }

    onDeleteComment = async() => {
        const deleteCommentId = await Fire.deleteComment(this.props.commentId)
        return deleteCommentId
    }

    onReportPressed = async() => {
        let {eventId, commentId} = this.props
        const {userId, username, email} = this.props.currentUser
        let reportInfo = null
        if (eventId){
            commentId = null
        } else {
            eventId = null
        }
        reportInfo = {
            event_id: eventId,
            comment_id: commentId,
            user_id: userId,
            username: username,
            email: email
        }
        const reportId = await Fire.onReport(reportInfo)
        this.reportAlert()

    }

    reportAlert = () => {
        Alert.alert(
            'Report',
            'Report Succeed',
            [
                {
                    text: 'Close',
                    style: 'cancel',
                    onPress: () => this.onBackdropPress()
                }
            ]
        )
    }

    render(){

        let deleteBtn = null
        let reportBtn = null
        if (Fire.uid === this.props.hostUserId || this.props.currentUser.moderator){
            deleteBtn = (
                <TouchableOpacity style={[styles.optionBtnStyle]} onPress={this.onDeletePress}>
                    <Text adjustsFontSizeToFit style={[styles.optionsTextStyle, {color: 'red'}]}>Delete</Text>
                </TouchableOpacity>
            )
            reportBtn = null
        } else {
            reportBtn = (
                <TouchableOpacity style={styles.optionBtnStyle} onPress={this.onReportPressed}>
                    <Text adjustsFontSizeToFit style={[styles.optionsTextStyle]}>Report</Text>
                </TouchableOpacity>
            )
        }



        return(

            <Modal
            backdropOpacity={0}
            isVisible={this.state.isOptionVisible}
            onBackdropPress={this.onBackdropPress}
            style={{justifyContent: 'flex-end', alignContent: 'center'}}
            >
                <View style={styles.container}>
                    {reportBtn}
                    {(Fire.uid === this.props.hostUserId) ? <View style={styles.breakLine}/> : null}
                    {deleteBtn}
                </View>
            </Modal>

        )
    }

}

const mapStateToProps = state => {
    return {
        currentUser: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onDeleteEvent: (eventId) => dispatch(deleteEvent(eventId)),
        onDeleteComment: (commentId) => dispatch(deleteComment(commentId))
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 70,
        borderWidth: 0.5,
        borderColor: "#DDDED1",
    },
    optionsTextStyle:{
        fontSize: 20,
    },
    optionBtnStyle:{
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    breakLine:{
        borderBottomColor: "#DDDED1",
        borderBottomWidth: 1,
        width: '100%'
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(EventOption)