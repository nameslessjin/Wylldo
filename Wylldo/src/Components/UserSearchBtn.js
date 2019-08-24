import React from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import {Navigation} from 'react-native-navigation'

const {height, width} = Dimensions.get('window')
export default class UserSearchBtn extends React.Component{

    _handleSearchPress = () => {
        const {componentId, following_list} = this.props
        Navigation.push(componentId, {
            component: {
                name: 'UserSearch',
                passProps: {
                    componentId: componentId,
                    following_list: following_list
                }
            }
        })
    }

    render(){

        return(
            <TouchableOpacity style={[styles.btnStyle]} onPress={this._handleSearchPress}>
                <Text adjustsFontSizeToFit style={styles.textStyle}>Search</Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    btnStyle: {
        width: 0.08 * height,
        height: 0.045 * height,
        borderRadius: 0.027 * height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 0.5
    },
    textStyle:{
        fontSize: 0.018 * height,
        fontFamily: 'Jellee-Roman',
        color: 'black',
    }
})