import {GoogleAutoComplete} from 'react-native-google-autocomplete'
import React from 'react'
import {StyleSheet, View, TextInput, ScrollView, ActivityIndicator, Platform, Dimensions} from 'react-native'
import {IOS_GOOGLE_PLACE_API_KEY, ANDROID_GOOGLE_PLACE_API_KEY} from '../key'
import LocationItem from './LocationItem'

const {height} = Dimensions.get('window')

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
                    queryTypes={'establishment'}
                    lat={this.props.location.latitude}
                    lng={this.props.location.longitude}
                >
                    
                    {({handleTextChange, locationResults, fetchDetails, isSearching, inputValue, clearSearchs}) => (
                        <React.Fragment>
                            {(inputValue=='') ? locationResults=[] : null}
                            <View>
                                <TextInput 
                                    adjustsFontSizeToFit
                                    style={styles.textInput}
                                    placeholder="Search a place or press the map"
                                    onChangeText={handleTextChange}
                                    value={inputValue}
                                />
                            </View>

                            {isSearching && <ActivityIndicator size="large" color="grey"/>}
                            <ScrollView style={styles.locationItems}>
                                {locationResults.map(el => (
                                    <LocationItem
                                        {...el}
                                        key={el.place_id}
                                        fetchDetails={fetchDetails}
                                        returnDetails={details => {
                                            console.log(details)
                                            this.props.returnDetails(details)
                                            clearSearchs()
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
        backgroundColor: '#fff',
        height: (Platform.OS == 'ios') ? '5%' : '7%',
        width: '75%',
        bottom: '45%',
        borderRadius: 10
    },
    textInput:{
        height: '100%',
        width: '100%',
        paddingHorizontal: 16,
    },
    locationItems:{
        top: '100%',
        maxHeight: 200,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 10
    }
})