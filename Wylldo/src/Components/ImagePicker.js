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
        ImagePicker.showImagePicker({title:"Pick a photo", maxWidth: 600, maxHeight: 600}, res => {
            if (res.didCancel){
                console.log("Image cancelled")
            } else if (res.error){
                console.log("Error", error)
            } else {
                this.setState({
                    pickedImage: {
                        uri: res.uri,
                        height: res.height,
                        width: res.width
                    },
                    Clicked: true
                })
                this.props.updateImage(this.state.pickedImage)
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
        resizeMode: 'cover',
        width: "100%",
        height: "100%"
    }
})