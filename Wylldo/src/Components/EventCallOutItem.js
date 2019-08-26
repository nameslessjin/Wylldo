import React from 'react'
import { View, StyleSheet, Text, ImageBackground, Image} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons"

export default class EventCallOutItem extends React.Component{

    onLoad = () => {
        
        this.forceUpdate()
    }


    render() {
        const {icon, hostAvatar, likes, id} = this.props
        return (
            <View 
                style={[styles.container, likes >= 10 ? {backgroundColor: '#e74c3c'} : null]}
                >
                {/* <View style={styles.imgStyle}>
                    <ImageBackground
                        source={hostAvatar}
                        style={styles.imgStyle} imageStyle={{resizeMode: 'cover'}}
                        onLoad  = {() => this.forceUpdate()}
                        >
                    </ImageBackground>
                </View> */}

                <Image
                    source = {hostAvatar}
                    style={styles.imgStyle}
                    onLoad={() => this.forceUpdate()}
                />
                <Icon name={icon} size={15} />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        height: 35,
        padding: 3,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    ImgView:{
        borderRadius: 14,
        height: '95%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle:{
        height: '100%',
        aspectRatio: 1,
        borderRadius: 14,
        backgroundColor: 'green',
    }
})