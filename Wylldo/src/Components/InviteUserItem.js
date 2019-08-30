import React from 'react'
import { View, Text, TouchableWithoutFeedback, StyleSheet, Image} from 'react-native'

export default class InviteUserItem extends React.Component{

    state ={
        press: false
    }

    _onUserPress = () => {
        const {userId, onSelectUser, onDeselectUser} = this.props
        const {press} = this.state
        
        if (!press){
            onSelectUser(userId)
            this.setState({press: true})
        } else {
            onDeselectUser(userId)
            this.setState({press: false})
        }
    }

    render(){
        const {avatarUri, username} = this.props
        const {press} = this.state
        return(
            <TouchableWithoutFeedback onPress={this._onUserPress}>
                <View style={[styles.container, (press) ? {backgroundColor: '#FE4C4C'} : null ]}>
                    <Image source={avatarUri} style={styles.imageStyle} />
                    <Text adjustsFontSizeToFit style={styles.usernameStyle} >{username}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 85,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingLeft: 10,
        
    },
    imageStyle:{
        height: 70,
        width: 70,
        borderRadius: 35,
        aspectRatio: 1,
        marginRight: 10
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 15,
    }
})