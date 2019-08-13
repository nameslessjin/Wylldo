//Home page
import React from 'react'
import {View, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator} from 'react-native'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import mapStyle from '../UI/MapStyle'
import CustomMarker from '../Components/CustomMarker'
import PopUpWnd from '../Components/PopUpWnd'
import {connect} from 'react-redux'
import Fire from '../firebase/Fire'
import {getCurrentUser, getMapEvents} from '../store/actions/action.index'
import {goToAuth} from '../navigation'
import {Navigation} from 'react-native-navigation'
import firebase from 'react-native-firebase'
import GooglePlaceAutoComplete from '../Components/GoogleAutocomplete'
// import GooglePlacesInput from '../Components/GooglePlacesInput'


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


    constructor(props){
        super(props)
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(this.tabChanged)
        this.state = {
            paddingTop: 1,
            markPressed: false,
            mapPressed: false,
            eventKey: null,
            pressedEvent: null,
            mapEventKey: null,
            refreshing: false
        }
    }

    state = {
        userLocation:{}
    }

    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {

        if (selectedTabIndex == 0 && unselectedTabIndex != 0){
            if(Fire.uid){
                this.getMapEventData(this.state.userLocation).then(mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                })
            } else {
                goToAuth()
            }
        }
        else if (selectedTabIndex==1 && unselectedTabIndex !=1){
            this.setState({markPressed: false, mapPressed: false})
        }
        else if (selectedTabIndex==2 && unselectedTabIndex != 2){
            this.setState({markPressed: false, mapPressed: false})
            if(Fire.uid){
                this.getCurrentUserData().then(currentUserData => {
                    this.props.onGetCurrentUser(currentUserData)
                })
            } else {
                goToAuth()
            }
        }

    }


    componentDidMount(){
        if (Platform.OS == 'android'){
            Fire.createChannel()
        }
        this.findCoordinates()
        // this.onPermissionRequest()
        this.createNotificationListeners();
        this.setState({refreshing: true})
        this.getCurrentUserData().then(currentUserData => {
            this.props.onGetCurrentUser(currentUserData)
            // this.getMapEventData().then( mapEvents => {
            //     this.props.onGetMapEvents(mapEvents)
            // })
            // .catch(error => {console.log(error)})
        })
        this.setState({refreshing: false})

    }


    componentWillUnmount(){
        this.bottomTabEventListener.remove()
        this.notificationListener()
        navigator.geolocation.clearWatch(this.watchId)
    }

    findCoordinates = () => {
        this.watchId = navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    ...userLocation,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0244,
                    longitudeDelta: 0.0244,
                    timestamp: position.coords.timestamp
                }

                this.setState({userLocation})
                this.getMapEventData(userLocation).then( mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                })
                .catch(error => {console.log(error)})
            },
            error => console.log(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
    }


    createNotificationListeners = async() => {
        this.notificationListener = firebase.notifications().onNotification((res) => {
            const {notificationId, title, body, data} = res
            const notification = new firebase.notifications.Notification()
                .setNotificationId(notificationId)
                .setTitle(title)
                .setBody(body)
                .setData({
                    key: data
                })
            firebase.notifications().displayNotification(notification)
        })

    }


    // When mark is pressed.  This part it rendered twice.
    // shouldComponentUpdate(nextProps, nextState){
    //     return nextState.mapEventKey != this.state.mapEventKey
    // }

    getCurrentUserData = async () => {
        const currentUserData = await Fire.getUserData(Fire.uid)
        return currentUserData
    }

    getMapEventData = async (userLocation) => {
        const {latitude, longitude} = userLocation
        const queryLocation = {latitude: latitude, longitude: longitude}
        const mapEventData = await Fire.getMapEvents(queryLocation)
        return mapEventData
    }

    mapViewPressedHandler = () => {
        this.setState({markPressed: false, mapPressed: true})
    }

    getPressedEvent = async (mapEventKey) =>{
        let pressedEventData = await Fire.getEventsWithId(mapEventKey)
        pressedEventData = {
            ...pressedEventData,
            eventId: mapEventKey
        }
        this.setState({pressedEvent: pressedEventData})
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

    onPopUpPress = () => {
        this.setState({markPressed: false, mapPressed: false})
    }

    render(){
        const Markers = this.props.mapEvents.map(mapEvent => {
            if (mapEvent.coords){
                const coords = {latitude: mapEvent.coords._latitude, longitude: mapEvent.coords._longitude}
                return(
                    <Marker
                    coordinate={coords}
                    key={mapEvent.key}
                    onPress={() => {this.getPressedEvent(mapEvent.key)} }
                    >       
                     
                    <CustomMarker icon={mapEvent.tag} hostAvatar={mapEvent.hostAvatar} likes={mapEvent.likes} />
                    </Marker>
                )
            }
        }) 

        let popUp = null 
        if (this.state.markPressed && !this.state.mapPressed){         
            const pressedEvent = this.state.pressedEvent
            if (pressedEvent){
                popUp = <PopUpWnd {...pressedEvent}  componentId={this.props.componentId} onPress={() => this.onPopUpPress()} />
            } else{
                popUp = null
            }
        } else {
            popUp = <View></View>
        }

        return(
            <View style={[styles.container]}>
                
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={this.state.markPressed ? false : true}
                    initialRegion={this.state.userLocation} 
                    style={styles.mapStyle} 
                    provider={PROVIDER_GOOGLE} 
                    customMapStyle={mapStyle}
                    onPress={this.mapViewPressedHandler}
                    onMarkerPress={this.markPressedHandler}
                    onMapReady={(Platform.OS==='android') ? this.onMapReady : null} >
                    {Markers}
                </MapView>
                {popUp}
                {/* <GooglePlacesInput/> */}
                <GooglePlaceAutoComplete></GooglePlaceAutoComplete>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mapStyle:{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        position: 'absolute'
    },
    IndicatorView:{
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const mapStateToProps = state => {
    return{
        events: state.events.Events,
        mapEvents: state.events.mapEvents
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetCurrentUser: (currentUserData) => dispatch(getCurrentUser(currentUserData)),
        onGetMapEvents: (mapEvents) => dispatch(getMapEvents(mapEvents))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)