//Home page

import React from 'react'
import {View, Text, StyleSheet, AsyncStorage, Dimensions, Button, Platform} from 'react-native'
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
                },
                visible: false,
                height: 0
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
                    latitude: 40.798599,
                    longitude: -77.856654
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
        ],
        markPressed: false,
        mapPressed: false,
        currentPositionBtn: true,
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

    mapViewPressedHandler = () => {
        this.setState({markPressed: false, mapPressed: true})

    }
    markPressedHandler = () => {
        console.log("MarkPressed", this.state.markPressed, "MapPressed", this.state.mapPressed  )
        this.setState({markPressed: true, mapPressed: false})
    }

    onMapReady = () =>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                this.setState({paddingTop: 0})
            })
    }


    render(){

        const Markers = this.state.markers.map(marker => (
            <Marker
                coordinate={marker.coordinate}
                key = {marker.key}
                
            >
                <CustomMarker 
                    icon = {marker.icon}/>
            </Marker>
        ))

        let modal = null
        
        if (this.state.markPressed && !this.state.mapPressed){
            console.log("Show")
            modal = <View style = {styles.modal} ></View>
        } else {
            console.log("Hide")
            modal = <View></View>
        }

        return(
            <View style={{width: "100%", height: "100%", paddingTop: this.state.paddingTop}}>
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={this.state.markPressed ? false : true}
                    initialRegion={this.state.userLocation} 
                    style={styles.container} 
                    provider={PROVIDER_GOOGLE} 
                    customMapStyle={mapStyle}
                    onPress={this.mapViewPressedHandler}
                    onMarkerPress={this.markPressedHandler}
                    onMapReady={(Platform.OS==='android') ? this.onMapReady : null} >


                    {Markers}

                </MapView>
                {modal}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modal:{
        width: "90%",
        height: "35%",
        backgroundColor: "white",
        borderRadius: 20,
        position: 'absolute',
        top: "64%",
        left: "5%"
    }
})