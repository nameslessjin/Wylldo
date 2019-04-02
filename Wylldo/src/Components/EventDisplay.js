import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import Header from './Header'



export default class EventDispaly extends React.Component{
 


    render(){

        let aspect = null
        let imgW = null
        let imgH = null
        if (this.props.image){
            imgW = this.props.image.width
            imgH = this.props.image.height
            aspect = imgW / imgH
        }
        // console.log(aspect)
        
        return(
            
            <View style={styles.container}>
                <Header name={this.props.name} />

                <View style={[styles.imageContainer, {aspectRatio: aspect}]}>
                    {/* <Image
                        resizeMode= 'contain'
                        style={{width: '100%', height:'100%'}}
                        source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
                        /> */}
                    <Image source={this.props.image} resizeMode='contain' style={styles.image} />
                </View>
                <View>
                    <Text>Footer</Text>
                    <Text>{this.props.description}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    imageContainer:{
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
    },
    image:{
        width: "100%",
        resizeMode: 'contain',
        height:'100%',
        backgroundColor: '#D8D8D8',
    }
})