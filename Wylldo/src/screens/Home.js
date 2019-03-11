import React from 'react'
import {View, Text, StyleSheet, AsyncStorage} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {USER_KEY} from '../config'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import mapStyle from '../UI/MapStyle'

export default class Home extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Home'
                }
            }
        }
    }


    render(){

 
        return(
            <MapView 
                style={styles.container} 
                provider={PROVIDER_GOOGLE} 
                customMapStyle={mapStyle} >

            </MapView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    }
})