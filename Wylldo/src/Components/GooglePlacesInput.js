import React from 'react';
import {Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {IOS_GOOGLE_PLACE_API_KEY, ANDROID_GOOGLE_PLACE_API_KEY} from '../key'

export default GooglePlacesInput = () => {
    return (
        <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            keyboardAppearance={'light'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={row => row.description}
            onPress={(data, details = null) => {
                console.log(data, details)
            }}

            getDefaultValue={() => ''}

            query={{
                key: IOS_GOOGLE_PLACE_API_KEY,
                language: 'en',
                types: '(cities)'
            }}

            style={{
                textInputContainer:{
                    width: '100%',
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                },
                container: {
                    height: '50%'
                }

            }}

            currentLocation={true}
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch'
            GooglePlacesSearchQuery={{
                rankby: 'distance',
                type: 'cafe'
            }}
            GooglePlacesDetailsQuery={{
                fields: 'formatted_address'
            }}

            debounce={200}
        
        />
    )
}