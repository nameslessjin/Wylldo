import React from 'react'
import {View, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native'
import mapStyle from '../UI/MapStyle'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import GooglePlaceAutoComplete from '../Components/GoogleAutocomplete'
import {IOS_GOOGLE_PLACE_API_KEY, ANDROID_GOOGLE_PLACE_API_KEY} from '../key'

const GOOGLE_API='https://maps.googleapis.com/maps/api/geocode/json'
export default class AddMap extends React.Component{

    static options(){
        return{
            bottomTabs: {
                visible: false
            },
            topBar:{
                title:{
                    text: 'Add Your Location',
                    alignment: 'center'
                },
                backButton:{
                    showTitle: false
                },
                rightButtons:[
                    {
                        id: 'AddEvent',
                        text: 'Next',
                        color: '#0481fe'
                    }
                ]
            }
        }
    }

    state={
        userLocation:{
            latitude: 40.798699,
            longitude: -77.859954,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122,
        },
        eventLocation: null,
        locationDetails: null,
    }

    constructor(props){
        super(props);
        Navigation.events().bindComponent(this);
    }

    componentDidUpdate(prevPros, prevState){
        const {locationDetails} = this.state
        if (locationDetails){
            const locationCoordinate= {
                latitude: locationDetails.geometry.location.lat,
                longitude: locationDetails.geometry.location.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0122
            }
            this.animateToRegion(locationCoordinate)
        }
    }

    animateToRegion = (coords) => {
        this.map.animateToRegion({
            ...coords
        })
    }

    navigationButtonPressed({buttonId}){
        if(buttonId == "AddEvent"){
            const {eventLocation, locationDetails} = this.state
            let pinLocation = null
            console.log(eventLocation)
            if (eventLocation){
                const addressNum = eventLocation.details.address_components[0].short_name
                const addressSt = eventLocation.details.address_components[1].short_name
                const addressCity = eventLocation.details.address_components[2].short_name
                let pinAddress = `${addressNum} ${addressSt} ${addressCity}`
                pinLocation = {
                    short_address: pinAddress,
                    formatted_address: eventLocation.details.formatted_address,
                    coords: {
                        latitude: eventLocation.latitude,
                        longitude: eventLocation.longitude
                    },
                    place_id: eventLocation.details.place_id
                }
            }
            let searchLocation = null
            if(locationDetails){
                const locationCoordinate= {
                    latitude: locationDetails.geometry.location.lat,
                    longitude: locationDetails.geometry.location.lng,
                }
                const searchAddressNum = locationDetails.address_components[0].short_name
                const searchAdressSt = locationDetails.address_components[1].short_name
                const searchAddressCity = locationDetails.address_components[2].short_name
                const searchAddress = `${searchAddressNum} ${searchAdressSt} ${searchAddressCity}`
                const searchAddressName = locationDetails.name
                searchLocation = {
                    name: searchAddressName,
                    short_address: searchAddress,
                    formatted_address: locationDetails.formatted_address,
                    coords: locationCoordinate,
                    place_id: locationDetails.place_id
                }
            }

            Navigation.push(this.props.componentId, {
                component:{
                    name: 'AddEvent',
                    passProps:{
                        searchLocation: searchLocation,
                        pinLocation: pinLocation
                    }
                }
            })
            // const {eventLocation} = this.state
            // const {description, tag, startTime,
            //         endTime, inviteCount, viewType, invite_userId
            // } = this.props
            // const {username, display_name, avatarUri, follower_list} = this.props.currentUserData

            // const eventData={
            //.     description : description,
            //.     tag : tag,
            //.     coords : eventLocation,
            //.     likes: 0,
            //.     commentNum: 0,
            //.     timestamp: Date.now(),
            //.     hostUserId: Fire.uid,
            //.     hostUsername: username,
            //.     host_display_name: display_name,
            //.     hostAvatar: avatarUri.storageLocation,
            //.     startTime: startTime,
            //.     endTime: endTime,
            //.     inviteCount: inviteCount,
            //.     viewType: viewType,
            //.     invite_userId: invite_userId,
            //.     host_follower_list: follower_list
            // }
            // const image = this.props.image
            // const resizedImage = this.props.resizedImage
            // this.createEvent(eventData, image, resizedImage).then(newEvent => {
            //     this.props.onAddEvent(newEvent)
            // })
            // .catch((error) => (console.log(error.message)))

            // Navigation.popToRoot(this.props.componentId)
        }
    }

    // createEvent = async (eventInfo, image, resizedImage) => {
    //     const eventData = await Fire.addEvent(eventInfo, image, resizedImage)
    //     return eventData
    // }

    mapViewPressedHandler = event => {
        const coords = event.nativeEvent.coordinate
        this.getLocation(coords)
    }

    getLocation = (coords) => {
        const latitude = coords.latitude
        const longitude = coords.longitude
        const API_KEY = (Platform.OS=='android') ? ANDROID_GOOGLE_PLACE_API_KEY : IOS_GOOGLE_PLACE_API_KEY
        const url = `${GOOGLE_API}?latlng=${latitude},${longitude}&key=${API_KEY}`
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            this.setState(prevState => {
                return {
                    eventLocation: {
                        ...prevState.eventLocation,
                        details: data.results[0],
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }
                }
            })
        })
        .catch(err => console.error(err))
    }



    render(){
        const {eventLocation, locationDetails} = this.state
        let marker = null
        if(eventLocation){
            marker= <Marker pinColor="#e74c3c" coordinate={eventLocation} ></Marker>
        }

        let searchLocationMarker = null
        if (locationDetails) {
            // console.log(locationDetails)
            const locationCoordinate= {
                latitude: locationDetails.geometry.location.lat,
                longitude: locationDetails.geometry.location.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0122
            }
            
            const markerColor= (eventLocation.latitude==locationCoordinate.latitude && eventLocation.longitude==locationCoordinate.longitude) 
                            ? '#e74c3c' : "#DDDED1" 
            searchLocationMarker = (
                <Marker 
                    pinColor={markerColor}
                    coordinate={locationCoordinate} 
                    title={locationDetails.name}
                    description={'Press any place on the map to set your location'}
                />)
        }

        return(
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <MapView
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        initialRegion={this.state.userLocation}
                        provider={PROVIDER_GOOGLE}
                        customMapStyle={mapStyle}
                        style={styles.Map}
                        onPress={this.mapViewPressedHandler}
                        ref={ref => this.map = ref}
                        >
                        {searchLocationMarker}
                        {marker}
                    </MapView>
                </TouchableWithoutFeedback>
                <GooglePlaceAutoComplete
                    returnDetails={locationDetails => this.setState({locationDetails: locationDetails})}
                />
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    Map:{
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'absolute'
    }
})