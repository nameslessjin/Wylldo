import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {Navigation} from 'react-native-navigation'
import ProfileHistory from '../Components/ProfileHistory'


export default class OtherProfile extends React.Component {
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Profile',
                    alignment: 'center'
                }
            }
        }
    }

    render(){
        console.log(this.props)

        return(
            <View>
                <Text>Nothing here</Text>
            </View>
        )
    }
}

