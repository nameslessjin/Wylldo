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

        const displayImage= (
            <View style={[styles.imageContainer, {aspectRatio: aspect}]}>
                <Image source={this.props.image} resizeMode='contain' style={styles.image} />
            </View>
        )
        
        return(
            
            <View style={styles.container}>
                <Header name={this.props.name} {...this.props} />

                {displayImage}

                <View style={{backgroundColor: 'white', marginLeft: 5}}>
                    <Text>Footer</Text>
                    <Text>{this.props.description}</Text>
                    <Text style={{color: 'grey', fontSize: 10}} >{this.props.createdTime}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginBottom: 30
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