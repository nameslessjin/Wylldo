import React from 'react'
import {View, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard} from 'react-native'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {postComment} from '../store/actions/action.index'
import KeyboardShift from './KeyboardShift'


class CommentInput extends React.Component{


    state={
        comment: '',
        Focus: false,
        inputHeight: 0
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }
    
    componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
    }

    handleKeyboardDidShow = (event) => {
        const keyboardHeight = event.endCoordinates.height;
        this.setState({inputHeight: keyboardHeight - styles.textInputContainer.height})
    }

    handleKeyboardDidHide = () => {

    }

    onPostPressed  = () => {
        const {eventId, username, avatarUri} = this.props
        const commentInfo = {
            comment: this.state.comment,
            event_id: eventId,
            username: username,
            avatarUri: avatarUri
        }

        this.postComment(commentInfo)
        .then(comment => {
            this.setState({comment: '', Focus: false})
            this.props.onPostComment(comment)
        })
        .catch(error => console.log(error))
    }

    postComment = async (commentInfo) => {
        const comment = await Fire.addComments(commentInfo)
        return comment
    }

    onFocus = () => {
        this.setState({Focus: true})
    }

    onBlur = () => {
        this.setState({Focus: false})
    }


    render(){
        return(
            <View style={styles.container}>
                <View style={[styles.textInputContainer, 
                                (this.state.Focus) ? 
                                [styles.textInputContainerOnFocus, {bottom: this.state.inputHeight}] 
                                : null ]}>
                    <TextInput 
                        placeholder={"say something"}
                        multiline = {true}
                        style={styles.textInput}
                        onChangeText={(comment) => this.setState({comment: comment})}
                        value={this.state.comment}
                        maxLength = {200}
                        onSubmitEditing={Keyboard.dismiss}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        
                    />
                    <TouchableOpacity style={styles.postButton} onPress={this.onPostPressed}>
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return{
        onPostComment: (comment) => dispatch(postComment(comment)) 
    }
}

export default connect(null,mapDispatchToProps)(CommentInput)


const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 95,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white' ,
        borderTopWidth: 1,
        borderTopColor: "#DDDED1",

    },
    textInputContainer:{
        width: '85%',
        borderRadius: 20,
        borderColor: '#DDDED1',
        borderWidth: 0.5,
        backgroundColor: 'white',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 30,
        flexDirection: 'row'
    },
    textInputContainerOnFocus:{
        borderColor: '#0481fe',
    },  
    textInput:{
        width: '80%',
        marginLeft: 10
    },
    postButton:{
        marginRight: 10,
    },
    postButtonText:{
        color: '#0481fe'
    },

})