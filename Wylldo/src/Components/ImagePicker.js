import React from 'react'
import {View, Image, TouchableOpacity, StyleSheet, Text} from "react-native"
import ImagePicker from "react-native-image-picker";

export default class PickImage extends React.Component{
    state = {
        pickedImage: null,
        Clicked: false
    }

    reset = () => {
        this.setState({
            pickedImage: null
        })
    }

    pickImageHandler = () => {
        ImagePicker.showImagePicker({title:"Pick a photo", maxWidth: 800, maxHeight: 600}, res => {
            if (res.didCancel){
                console.log("Image cancelled")
            } else if (res.error){
                console.log("Error", error)
            } else {
                console.log(res)
                this.setState({
                    pickedImage: {uri: res.uri},
                    Clicked: true
                })
            }
        })
    }

    render(){

        const displayMessage = <Text>Click to add image</Text>
        const displayImage = <Image source={this.state.pickedImage} style={styles.image}/>

        return(
            <TouchableOpacity style={styles.container} onPress={this.pickImageHandler}>
                    {this.state.Clicked ? displayImage : displayMessage}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        flex: 1,
        resizeMode: 'contain',
        width: "100%",
        height: "100%"
    }
})