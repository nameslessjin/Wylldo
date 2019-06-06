import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'

export default class UserDisplay extends React.Component{




    render(){
        // console.log(this.props)

        const userProfilePic = (
            <TouchableOpacity style={styles.row}>
                <Image source={this.props.avatarUri} style={styles.imageStyle}/>
                <Text style={styles.usernameStyle}>{this.props.name}</Text>
            </TouchableOpacity>
        )

        const followBtn = (
            <TouchableOpacity style={styles.followBtnStyle}>
                <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
        )

        return(
            <View style={styles.container}>
                {userProfilePic}
                {followBtn}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: 80,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageStyle:{
        width: 70,
        height: 70,
        aspectRatio: 1,
        borderRadius: 34,
        marginRight: 10
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 18
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    followBtnStyle:{
        height: 40,
        width: 70,
        borderRadius: 25,
        backgroundColor: '#FE4C4C',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        fontFamily: 'ArialRoundedMTBold',
        fontSize: 16,
        color: 'white'
    }
})