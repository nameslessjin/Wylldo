import {GoogleAutoComplete} from 'react-native-google-autocomplete'
import React from 'react'
import {StyleSheet, View, TextInput, ScrollView, ActivityIndicator, Platform, Dimensions} from 'react-native'
import {IOS_GOOGLE_PLACE_API_KEY, ANDROID_GOOGLE_PLACE_API_KEY} from '../key'
import LocationItem from './LocationItem'

const {height, width} = Dimensions.get('window')

export default class GooglePlaceAutoComplete extends React.Component{

    state = {
        searchText: "",
    }

    render(){
        const API_KEY = (Platform.OS=='android') ? ANDROID_GOOGLE_PLACE_API_KEY : IOS_GOOGLE_PLACE_API_KEY
        return (
            <View style={styles.container}>
                <GoogleAutoComplete 
                    apiKey = {API_KEY}
                    debounce = {500}
                    minLength = {3}
                    radius= {'10000'}
                    queryTypes={'establishment'}
                    lat={this.props.location.latitude}
                    lng={this.props.location.longitude}
                >
                    
                    {({handleTextChange, locationResults, fetchDetails, isSearching, inputValue, clearSearchs}) => (
                        <React.Fragment>
                            {(inputValue=='') ? locationResults=[] : null}
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    adjustsFontSizeToFit
                                    style={styles.textInput}
                                    placeholder="Search a place or press the map"
                                    onChangeText={handleTextChange}
                                    value={inputValue}
                                />
                            </View>


                            {isSearching && <ActivityIndicator size="large" color="grey"/>}
                            <ScrollView style={styles.locationItems} keyboardDismissMode={'interactive'} >
                                {locationResults.map((el, i) => (
                                    <LocationItem
                                        {...el}
                                        key={String(i)}
                                        fetchDetails={fetchDetails}
                                        returnDetails={details => {
                                            clearSearchs()
                                            this.props.returnDetails(details)
                                        }}
                                    />
                                ))}
                            </ScrollView>
                        </React.Fragment>
                    )}
                </GoogleAutoComplete>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        bottom: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput:{
        height: '100%',
        width: '100%',
        paddingHorizontal: 16,
    },
    inputWrapper:{
        width: width * 0.75,
        borderWidth: 1,
        height: (Platform.OS == 'ios') ? height * 0.05 : height * 0.06,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    locationItems:{
        top: '100%',
        maxHeight: 200,
        width: '75%',
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 10,
        zIndex: 1
    }
})