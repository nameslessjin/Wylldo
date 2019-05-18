import React from 'react'
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class ProfileEventDisplay extends React.Component{

    render(){
        console.log(this.props)
        return(
            <TouchableOpacity style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.userProfilePic, styles.row]}/>
                    <Text style={styles.row}>{this.props.hostUsername}</Text>
                    <Icon style={styles.row} name={this.props.tag} size= {20} />
                </View>
                <Text>{this.props.startTime}</Text>
                <Text>{this.props.description}</Text>
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'red',
        marginBottom: 5,
        borderRadius: 10,
        padding: 10
    },
    header:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    userProfilePic:{
        width: 30,
        height: 30,
        aspectRatio: 1,
        borderRadius: 20,
        marginHorizontal: 7,
        backgroundColor: 'green'
    },
    row:{
        marginRight: 5
    }
})