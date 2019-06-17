import React from 'react'
import {View, StyleSheet} from 'react-native'
import CommentDisplay from '../Components/CommentDisplay'

export default class Comment extends React.Component{

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

    render(){
        const {createdTime, description, hostUserId, hostUsername, host_display_name, likes, hostAvatar} = this.props
        return(
            <View style={styles.container}>
                <View style={styles.commentContainer}>
                    <CommentDisplay
                        createdTime = {createdTime}
                        description = {description}
                        hostUserId = {hostUserId}
                        hostUsername = {hostUsername}
                        host_display_name = {host_display_name}
                        like_num = {likes}
                        hostAvatar = {hostAvatar}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commentContainer:{
        flex: 1,
        width: '95%',
    }
})