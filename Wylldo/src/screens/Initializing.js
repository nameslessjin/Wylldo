import React from 'react'
import { View, Text, StyleSheet, AsyncStorage} from 'react-native'

import {goToAuth, goHome} from '../navigation'
import {USER_KEY} from '../config'

export default class Initializing extends React.Component{

    async componentDidMount(){
        goHome()
    }


    render(){

        return(
            <View style={styles.container}>
                <Text style={styles.loading}>Loading</Text>
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