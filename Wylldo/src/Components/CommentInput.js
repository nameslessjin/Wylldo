import React from 'react'
import {View, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard, Platform} from 'react-native'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {postComment} from '../store/actions/action.index'


class CommentInput extends React.Component{


    state={
        comment: '',
        Focus: false,
        inputHeight: 0
    }

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    }
    
    componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    }

    handleKeyboardDidShow = (event) => {
        const keyboardHeight = event.endCoordinates.height;
        if (Platform.OS == 'ios'){
            this.setState({inputHeight: keyboardHeight - styles.textInputContainer.height})
        }
    }


    onPostPressed  = () => {
        const {eventId, username, avatarUri} = this.props
        const {comment} = this.state
        const commentInfo = {
            comment: comment.trim(),
            event_id: eventId,
            username: username,
            avatarUri: avatarUri,
            like_num: 0,
            like_userId: []
        }
        Keyboard.dismiss()
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
        const {comment, inputHeight, Focus} = this.state
        let postButton = (comment.trim() == '') ? (
            <View style={styles.postButton}>
                <Text style={[styles.postButtonText, {color: 'grey'}]}>Post</Text>
            </View>
        ) : (
            <TouchableOpacity style={styles.postButton} onPress={this.onPostPressed}>
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
        )

        return(
            <View style={styles.container}>
                <View style={[styles.textInputContainer, 
                                (Focus) ? 
                                [styles.textInputContainerOnFocus, {bottom: inputHeight}] 
                                : null ]}>
                    <TextInput 
                        placeholder={"say something"}
                        multiline = {true}
                        style={styles.textInput}
                        onChangeText={(comment) => this.setState({comment: comment})}
                        value={comment}
                        maxLength = {180}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        
                    />
                    {postButton}
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