import React from 'react'
import {View, Image, TouchableOpacity, StyleSheet, Text} from "react-native"
import ImagePicker from "react-native-image-picker";



export default class PickAvatar extends React.Component{
    state = {
        pickedAvatar: null,
        Clicked: false
    }

    pickImageHandler = () => {
        ImagePicker.showImagePicker({title: "Pick a Profile Picture", maxWidth: 200, maxHeight: 200}, res => {
            if (res.didCancel){
                console.log("Image cancelled")
            } else if (res.error){
                console.log("Error: ", error)
            } else {
                this.setState({
                    pickedAvatar: {uri : res.uri},
                    Clicked: true
                })
                this.props.updateAvatar(this.state.pickedAvatar)
            }
        })
    } 


    render(){

        let displayImage = null
        if (this.props.currentUser){
            if (!this.state.Clicked){
                displayImage = <Image source={this.props.currentUser.avatarUri} style={styles.image} />
            } else {
                displayImage = <Image source={this.state.pickedAvatar} style={styles.image} />
            }
        }

        return(
            <TouchableOpacity style={styles.avatar} onPress={this.pickImageHandler}>
                {displayImage}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    avatar:{
        height: '45%',
        width: '23%',
        borderRadius: 50,
        backgroundColor: 'orange',
        marginBottom: 10,
        marginTop: 20
    },
    image:{
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 42,
    }
})