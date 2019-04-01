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
            
            <View>
                <Header name={this.props.name} />
                <Image source={this.props.image} style={[styles.image,{height:imgH}]} />
                <Text>{this.props.description}</Text>
                
                
                
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
    },
    image:{
        resizeMode: 'contain',
        width: '100%',
        backgroundColor: '#D8D8D8',
    }
})