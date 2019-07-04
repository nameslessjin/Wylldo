import React from 'react'
import {View, StyleSheet, RefreshControl, LayoutAnimation} from 'react-native'
import ListComment from '../Components/ListComment'
import CommentInput from '../Components/CommentInput'
import {connect} from 'react-redux'
import Fire from '../firebase/Fire'
import {getComment} from '../store/actions/action.index'

class Comment extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Comments'
                },
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

    state={
        comment: [],
        refreshing: false,
        loading: false
    }

    componentDidMount(){
        const {eventId} = this.props
        this._onRefresh(eventId)
    }

    _onRefresh = (eventId) => this.getComments(eventId).then((comments) => {
        const {createdTime, description, hostUserId, hostUsername, hostAvatar} = this.props
        let comment = [{
            createdTime: createdTime,
            comment: description,
            user_id: hostUserId,
            username: hostUsername,
            user_avatar: hostAvatar,
            commentId: 'description-for-this-wylldo',
            key: 'description-for-this-wylldo'
        }]
        comment = comment.concat(comments)
        this.setState({comment: comment})
        this.props.onGetComment(comment)
    })

    getComments = async(eventId, startPosition) => {
        this.setState({refreshing: true})
        const {comments, start} = await Fire.getComments(eventId, startPosition)
        this.comment_startPosition = start
        this.setState({refreshing: false, loading: false})
        return comments
    }

    _loadMore = () => {
        this.setState({loading: true})
        if (this.comment_startPosition){
            const {eventId} = this.props
            const startPosition = this.comment_startPosition
            this.getComments(eventId, startPosition).then((comments) => {
                let comment = [...this.state.comment]
                comment = comment.concat(comments)
                this.setState({comment: comment})
                this.props.onGetComment(comment)
            })
            .catch( error => console.log(error))
        }
        this.setState({refreshing: false, loading: false})
    }


    render(){
        LayoutAnimation.easeInEaseOut()
        const {eventId, hostUserId} = this.props
        const {username, avatarUri} = this.props.currentUser
        return(
            <View style={styles.container}>
                <View style={styles.commentContainer}>
                    <ListComment
                        componentId = {this.props.componentId}
                        comments = {this.props.comment}
                        refreshControl = {
                            <RefreshControl
                                refreshing = {this.state.refreshing}
                                onRefresh = {() => this._onRefresh(eventId)}
                            />
                        }
                        onEndReached = {this._loadMore}
                        onEndReachedThreshold = {0}
                    
                    />

                </View>
                <CommentInput 
                    eventId={eventId}
                    username={username}
                    avatarUri = {avatarUri.storageLocation}
                    hostUserId={hostUserId}
                />
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.events.currentUser,
        comment: state.events.comment
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetComment: (comment) => dispatch(getComment(comment))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commentContainer:{
        flex: 1,
        width: '95%',
        marginBottom: 120
    },
    bottomView:{
        width: '100%',
        height: 80,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0 
    }
})