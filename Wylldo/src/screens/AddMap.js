import React from 'react'
import {View, Text, StyleSheet,Platform,PermissionsAndroid} from 'react-native'
import mapStyle from '../UI/MapStyle'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import {addEvent} from '../store/actions/action.index'
import Fire from '../firebase/Fire'
import GooglePlaceAutoComplete from '../Components/GoogleAutocomplete'

class AddMap extends React.Component{

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
                rightButtons:[
                    {
                        id: 'Post',
                        text: 'Post',
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
            locationDetails: null
        },
        eventLocation:{
            latitude: null,
            longitude: null
        }
    }

    constructor(props){
        super(props);
        Navigation.events().bindComponent(this);
    }

    componentDidUpdate(prevPros, prevState){
        if (this.state.locationDetails){
            const locationCoordinate= {
                latitude: this.state.locationDetails.geometry.location.lat,
                longitude: this.state.locationDetails.geometry.location.lng,
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
        if(buttonId == "Post"){
            const {eventLocation} = this.state
            const {description, tag, startTime,
                    endTime, inviteCount, viewType, invite_userId
            } = this.props
            const {username, display_name, avatarUri, follower_list} = this.props.currentUserData

            const eventData={
                description : description,
                tag : tag,
                coords : eventLocation,
                likes: 0,
                commentNum: 0,
                timestamp: Date.now(),
                hostUserId: Fire.uid,
                hostUsername: username,
                host_display_name: display_name,
                hostAvatar: avatarUri.storageLocation,
                startTime: startTime,
                endTime: endTime,
                inviteCount: inviteCount,
                viewType: viewType,
                invite_userId: invite_userId,
                host_follower_list: follower_list
            }
            const image = this.props.image
            const resizedImage = this.props.resizedImage
            this.createEvent(eventData, image, resizedImage).then(newEvent => {
                this.props.onAddEvent(newEvent)
            })
            .catch((error) => (console.log(error.message)))

            Navigation.popToRoot(this.props.componentId)
        }
    }

    createEvent = async (eventInfo, image, resizedImage) => {
        const eventData = await Fire.addEvent(eventInfo, image, resizedImage)
        return eventData
    }

    mapViewPressedHandler = event => {
        const coords = event.nativeEvent.coordinate
        this.setState(prevState => {
            return {
                eventLocation: {
                    ...prevState.eventLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
            }
        }) 
    }



    render(){
        console.log(this.props)
        const {eventLocation, locationDetails} = this.state
        let marker = null
        if(eventLocation.latitude){
            marker= <Marker pinColor="#e74c3c" coordinate={eventLocation} ></Marker>
        }

        let searchLocationMarker = null
        if (locationDetails) {
            console.log(locationDetails)
            const locationCoordinate= {
                latitude: locationDetails.geometry.location.lat,
                longitude: locationDetails.geometry.location.lng,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0122
            }
            
            const markerColor= (eventLocation.latitude==locationCoordinate.latitude && eventLocation.longitude==locationCoordinate.longitude ) 
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
                <GooglePlaceAutoComplete
                    returnDetails={locationDetails => this.setState({locationDetails: locationDetails})}
                />
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAddEvent: (eventInfo) => dispatch(addEvent(eventInfo))
    }
}
const mapStateToProps = state => {
    return {
        currentUserData: state.events.currentUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMap)

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