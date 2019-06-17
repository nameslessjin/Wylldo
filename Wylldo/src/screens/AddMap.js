import React from 'react'
import {View, Text, StyleSheet,Platform,PermissionsAndroid} from 'react-native'
import mapStyle from '../UI/MapStyle'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import {addEvent} from '../store/actions/action.index'
import Fire from '../firebase/Fire'

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
            const eventData={
                description : this.props.description,
                tag : this.props.tag,
                coords : this.state.eventLocation,
                likes: 0,
                commentNum: 0,
                timestamp: Date.now(),
                hostUserId: Fire.uid,
                hostUsername: this.props.currentUserData.username,
                host_display_name: this.props.currentUserData.display_name,
                hostAvatar: this.props.currentUserData.avatarUri.storageLocation,
                startTime: this.props.startTime,
                endTime: this.props.endTime,
                inviteCount: this.props.inviteCount,
                viewType: this.props.viewType
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
        let marker = null
        if(this.state.eventLocation.latitude){
            marker= <Marker coordinate={this.state.eventLocation} ></Marker>
        }
        return(
            <View style={{width: "100%", height: "100%", paddingTop: 0}}>
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
        justifyContent: 'center'
    },
    Map:{
        width: "100%",
        height: "100%"
    }
})