import React from 'react'
import {View, Image, TouchableOpacity, StyleSheet, Text} from "react-native"
import ImagePicker from "react-native-image-picker"
import ImageResizer from "react-native-image-resizer"

export default class PickImage extends React.Component{
    state = {
        pickedImage: null,
        Clicked: false,
        resizedImageUri: null
    }

    reset = () => {
        this.setState({
            pickedImage: null,
        })
    }

    pickImageHandler = () => {
        ImagePicker.showImagePicker({title:"Pick a photo", maxWidth: 800, maxHeight: 800}, res => {
            if (res.didCancel){
                console.log("Image cancelled")
            } else if (res.error){
                console.log("Error", error)
            } else {
                console.log(res.uri)
                console.log(res.fileSize)
                this.setState({
                    pickedImage: {
                        uri: res.uri,
                        height: res.height,
                        width: res.width
                    },
                    Clicked: true
                })
                this.resizeImage(res.uri)
                this.props.updateImage(this.state.pickedImage)
                this.props.resizedImageUri(this.state.resizedImageUri)
            }
        })
    }

    resizeImage = (imageUri) => {
        ImageResizer.createResizedImage(imageUri, 300, 300, "JPEG", 70, 0, null).then(res => console.log('resizeWorks:', res))
        .catch(err => console.log(err))

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