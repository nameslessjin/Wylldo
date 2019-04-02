import React from 'react'
import {StyleSheet, View, Text, Image} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'


export default class Header extends React.Component{

    render(){
        console.log(this.props.name)
        return(
            <View style={styles.container}>
                <Image
                    style={styles.userProfilePic}
                    source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                />
                <Text style={styles.usernameStyle}>{this.props.name}</Text>
                <Icon name={this.props.tag} size={20} style={{marginLeft: 5}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height: 55,
        width:  "100%",
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    usernameStyle:{
        fontWeight: 'bold',
        fontSize: 16
    },
    userProfilePic:{
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 5
    },
})