import {GoogleAutoComplete} from 'react-native-google-autocomplete'
import React from 'react'
import {StyleSheet, Text, View, Platform, TextInput} from 'react-native'
import {IOS_GOOGLE_PLACE_API_KEY, ANDROID_GOOGLE_PLACE_API_KEY} from '../key'

export default class GooglePlaceAutoComplete extends React.Component{
    render(){
        const API_KEY = (Platform.OS=='android') ? ANDROID_GOOGLE_PLACE_API_KEY : IOS_GOOGLE_PLACE_API_KEY
        return (
            <View style={styles.container}>
                <GoogleAutoComplete 
                    apiKey = {API_KEY}>
                    {({}) => (
                        <React.Fragment>
                            <View>
                                <TextInput 
                                    style={styles.textInput}
                                    placeholder="Search a place"
                                />
                            </View>
                        </React.Fragment>
                    )}

                </GoogleAutoComplete>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        height: '5%',
        width: '75%',
        bottom: '40%',
        borderRadius: 10
    },
    textInput:{
        height: '100%',
        width: '100%',
        paddingHorizontal: 16,

    }
})