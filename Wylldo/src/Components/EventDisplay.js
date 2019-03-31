import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'



export default class EventDispaly extends React.Component{
 


    render(){


        const imgW = this.props.image ? this.props.image.width : null
        const imgH = this.props.image ? this.props.image.height : null
        const aspect = this.props.image ? imgH / imgW : null
        console.log(aspect)
        
        return(
            
            <View>

                <Image source={this.props.image} style={[styles.image]} />
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
        backgroundColor: '#D8D8D8',
        width: '100%'
    }
})