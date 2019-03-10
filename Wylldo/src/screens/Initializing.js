import React from 'react'
import { View, Text, StyleSheet, AsyncStorage} from 'react-native'

import {goToAuth, goHome} from '../navigation'
import {USER_KEY} from '../config'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Initializing extends React.Component{

    async componentDidMount(){
        goHome()
    }


    render(){

        return(
            <View style={styles.container}>
                <Text style={styles.loading}>Loading</Text>
                <Icon name="md-home" size={30} color="black" />
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading:{
        fontSize: 28
    }
})