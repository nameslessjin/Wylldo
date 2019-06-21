import React from 'react'
import {View, Image, TouchableOpacity, StyleSheet, Text} from "react-native"
import ImagePicker from "react-native-image-picker";



export default class PickAvatar extends React.Component{
    state = {
        pickedAvatar: null,
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
                })
                this.props.updateAvatar(this.state.pickedAvatar)
            }
        })
    } 


    render(){


        displayImage = (
            <Image 
                source={(!this.state.pickedAvatar) ? this.props.avatarUri : this.state.pickedAvatar} 
                style={styles.image} />
        )

        return(
            <TouchableOpacity style={styles.avatar} onPress={this.pickImageHandler}>
                {displayImage}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    avatar:{
        height: 85,
        width: 85,
        borderRadius: 43,
        marginBottom: 10,
        marginTop: 20
    },
    image:{
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 42,
    }
})