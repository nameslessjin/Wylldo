import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import Header from './Header'
import Footer from './Footer'


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
            //Try to remove componentId in footer since everything is passed already
            <View style={styles.container}>
                <Header {...this.props} />
                {displayImage}
                <Footer {...this.props} componentId={this.props.componentId}/>
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