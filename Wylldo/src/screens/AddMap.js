import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import mapStyle from '../UI/MapStyle'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import {addEvent} from '../store/actions/action.index'


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
            longitudeDelta: 0.0122
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

    navigationButtonPressed({buttonId}){
        if(buttonId == "Post"){
            const eventState={
                description : this.props.description,
                tag : this.props.tag,
                image : this.props.image,
                coords : this.state.eventLocation,
                key: this.props.tag + this.state.eventLocation.latitude + this.props.image.uri + this.state.eventLocation.longitude + this.props.description
            }
            this.props.onAddEvent(eventState)
            Navigation.popToRoot(this.props.componentId)
        }
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
        console.log(this.props)
        
    }

    render(){
        let marker = null
        if(this.state.eventLocation.latitude){
            marker= <Marker coordinate={this.state.eventLocation} ></Marker>
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
                    onLongPress={this.mapViewPressedHandler}
                    >

                    {marker}
                    
                </MapView>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAddEvent: (eventState) => dispatch(addEvent(eventState))
    }
}

export default connect(null,mapDispatchToProps)(AddMap)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Map:{
        width: "100%",
        height: "100%"
    }
})