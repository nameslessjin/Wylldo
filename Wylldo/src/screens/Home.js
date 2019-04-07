//Home page

import React from 'react'
import {View, Text, StyleSheet, AsyncStorage, Dimensions, Button, Platform, PermissionsAndroid, YellowBox} from 'react-native'
import {Navigation} from 'react-native-navigation'
import {USER_KEY} from '../config'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import mapStyle from '../UI/MapStyle'
import CustomMarker from '../Components/CustomMarker'
import PopUpWnd from '../Components/PopUpWnd'
import {connect} from 'react-redux'
import Firestore from '../firebase/Fire'
import {getEvents} from '../store/actions/action.index'


YellowBox.ignoreWarnings([
                    'Require cycle:', 
                    'Accessing view manager configs directly off UIManager via UIManager[\'AIRGoogleMap\']'
                ])

class Home extends React.Component{
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

//In initial AppLaunch, retrieve all locations and all events and put to state reducer

    state = {
        userLocation:{
            latitude: 40.798699,
            longitude: -77.859954 ,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122
        },
        paddingTop: 1,
        markPressed: false,
        mapPressed: false,
        eventKey: null,
        events:[]
    }

    

    componentDidMount(){
        this.getEventData().then( events =>{
                this.props.onGetEvents(events)
            }
        )

    }


    getEventData = async () => {
        const eventData = await Firestore.getEvents(20)
        this.setEvents(eventData)
        return this.state.events
    }

    setEvents = events => {
        this.setState(prevState => {
            return{
                events: events
            }
        })
    }



    mapViewPressedHandler = () => {
        this.setState({markPressed: false, mapPressed: true})
   

    }
    markPressedHandler = () => {
        this.setState({markPressed: true, mapPressed: false})

    }

    onMapReady = () =>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                this.setState({paddingTop: 0})
            })
    }


    render(){
        const Markers = this.props.events.map(event => {
            if (event.coords.latitude !== null){
                return(
                    <Marker
                    coordinate={event.coords}
                    key={event.key}
                    onPress={() => this.setState({eventKey : event.key}) }
                    >        
                    <CustomMarker icon={event.tag} />
                    </Marker>
                )
            }
        })
        

        let popUp = null 
        if (this.state.markPressed && !this.state.mapPressed){         
            const markerEvent = this.props.events.filter(event=> {
                return event.key === this.state.eventKey
            })
            popUp = <PopUpWnd {...markerEvent[0]}  componentId={this.props.componentId}/>
        } else {
            popUp = <View></View>
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
                {popUp}
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
})


const mapStateToProps = state => {
    return{
        events: state.events.Events
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetEvents: (events) => dispatch(getEvents(events))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)