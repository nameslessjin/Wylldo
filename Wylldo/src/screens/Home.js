//Home page

import React from 'react'
import {View, Text, StyleSheet, AsyncStorage, Dimensions, Button} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {USER_KEY} from '../config'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import mapStyle from '../UI/MapStyle'
import CustomMarker from '../Components/CustomMarker'
import {PermissionsAndroid} from 'react-native'

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

    state = {
        userLocation:{
            latitude: 40.798699,
            longitude: -77.859954 ,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122
        },
        paddingTop: 1,
        markers:[
            {
                coordinate:{
                    latitude: 40.798699,
                    longitude: -77.859954
                },
                key: 1,
                icon: "md-american-football"
            },
            {
                coordinate:{
                    latitude: 40.794000,
                    longitude: -77.859954
                },
                key: 2,
                icon: "md-beer"    
            }
        ]
    }

    pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.setState(prevState => {
            return {
                userLocation: {
                    ...prevState.userLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                  }
            }
        })
    }

    getUserLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const coordsEvent = {
                    nativeEvent:{
                        coordinate: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                    }
                }
                this.pickLocationHandler(coordsEvent)
            },
            error => {
                console.log(error)
                alert("error")
            }
        )
    }

    onMapReady = () =>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                this.setState({paddingTop: 0})
            })
    }


    render(){

        let Markers = this.state.markers.map(marker => (
            <Marker
                coordinate={marker.coordinate}
                key = {marker.key}
            >
                <CustomMarker icon = {marker.icon} />
            </Marker>
        ))

        return(
            <View style={{width: "100%", height: "100%", paddingTop: this.state.paddingTop}}>
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={this.state.userLocation} 
                    style={styles.container} 
                    provider={PROVIDER_GOOGLE} 
                    customMapStyle={mapStyle}
                    onMapReady={this.onMapReady} >
                    
                    {Markers}

                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,

    }
})