//Home page
import React from 'react'
import {View, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator, Text, ScrollView, Dimensions, Keyboard} from 'react-native'
import {PROVIDER_GOOGLE, Marker, Callout,} from 'react-native-maps'
import ClusteredMapView from 'react-native-maps-super-cluster'
import mapStyle from '../UI/MapStyle'
import CustomMarker from '../Components/CustomMarker'
import PopUpWnd from '../Components/PopUpWnd'
import {connect} from 'react-redux'
import Fire from '../firebase/Fire'
import {getCurrentUser, getMapEvents} from '../store/actions/action.index'
import {goToAuth} from '../navigation'
import {Navigation} from 'react-native-navigation'
import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/Ionicons'
import EventCallOutItem from '../Components/EventCallOutItem'
import GooglePlaceAutoComplete from '../Components/GoogleAutocomplete'

const {width, height} = Dimensions.get('window')

const INIT_REGION = {
    latitude: 40.798699,
    longitude: -77.859954,
    latitudeDelta: 12,
    longitudeDelta: 12
  }
class Home extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text: 'Home'
                },
                visible: false,
                height: 0
            },
            // bottomTabs:{
            //     visible: false,
            //     drawBehind: true
            // }
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
            refreshing: false,
            locationDetails: null,
            loading: false,
            data: [],
            userLocation: {},
            isSameLocation: false,
            clusterPressed: false,
            clusterCarryOn: false,
            initialLoad: true
            
        }
    }


    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {

        if (selectedTabIndex == 0 && unselectedTabIndex != 0){
            if(Fire.uid){
                this.findCoordinates()
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

    componentDidUpdate(prevProps, prevState){
        const {userLocation, locationDetails} = this.state

        if (userLocation != prevState.userLocation){
            this.animateToUserLocation(userLocation, 1)
        }

        if (locationDetails != prevState.locationDetails){
            const locationCoordinate= {
                latitude: locationDetails.geometry.location.lat,
                longitude: locationDetails.geometry.location.lng,
                latitudeDelta: 0.0032,
                longitudeDelta: 0.0032
            }
            this.map.getMapRef().animateToRegion(locationCoordinate, 1)
        }
    }

    componentWillUnmount(){
        this.bottomTabEventListener.remove()
        this.notificationListener()
        navigator.geolocation.clearWatch(this.watchId)
    }

    findCoordinates = () => {
        this.watchId = navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({loading: true})
                // For production
                const userLocation = {
                    ...userLocation,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0244,
                    longitudeDelta: 0.0244,
                    timestamp: new Date()
                }

                // // For development
                // const userLocation = {
                //     ...userLocation,
                //     latitude: 40.798699,
                //     longitude: -77.859954,
                //     latitudeDelta: 0.0244,
                //     longitudeDelta: 0.0244,
                //     timestamp: new Date()
                // }

                // console.log(userLocation)
                this.setState({userLocation})
                this.getMapEventData(userLocation).then( mapEvents => {
                    if (mapEvents == []){
                        this.setState({loading: false})
                    }
                    this.props.onGetMapEvents(mapEvents)
                    this.setState({loading: false, initialLoad: false})
                })
                .catch(error => {console.log(error)})
            },
            error => console.log(error.message),
            {enableHighAccuracy: false, timeout: 60000, maximumAge: 2000}
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
    shouldComponentUpdate(nextProps, nextState){
        return nextState != this.state
    }

    getCurrentUserData = async () => {
        const currentUserData = await Fire.getUserData(Fire.uid)
        return currentUserData
    }

    getMapEventData = async (userLocation) => {
        this.setState({loading: true})
        const {latitude, longitude} = userLocation
        const queryLocation = {latitude: latitude, longitude: longitude}
        const mapEventData = await Fire.getMapEvents(queryLocation)
        
        return mapEventData
    }

    onMapReady = () =>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: "Location Accessing Permission",
            message: "Wylldo needs access to your location to find local events"
        })
            .then(granted => {
                this.setState({paddingTop: 0})
            })
    }

    mapViewPressedHandler = () => {
        Keyboard.dismiss()
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

        const {clusterPressed} = this.state
        if (clusterPressed){
            this.setState({clusterPressed: false, markPressed: false})
        } else {
            this.setState({markPressed: true})
        }
        this.setState({mapPressed: false})

    }

    onPopUpPress = () => {
        this.setState({markPressed: false, mapPressed: false})
    }

    renderCluster = (cluster, onPress) => {
        const pointCount = cluster.pointCount,
              coordinate = cluster.coordinate,
              clusterId = cluster.clusterId

        const clusteringEngine = this.map.getClusteringEngine(),
              clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)
    
        let tagCount = [
            {name: 'Fun', tag: 'md-beer',  count: 0},
            {name: 'Sport', tag: 'md-american-football',  count: 0},
            {name: 'Study', tag: 'md-book', count: 0},
        ]

        let key = ''

        const clusterEvents = [...clusteredPoints].map((point, index) => {
            const data = point.properties.item
            return data
        })

        clusterEvents.forEach(event => {
            const eventTag = event.eventTag
            tagCount.forEach(type => {
                if (type.name == eventTag){
                    type.count = type.count + 1
                    let randomNumber = (Math.random()*100000).toString()
                    key = key.concat(type.name).concat(randomNumber)
                }
            })
        })

        let clusterEventsId = clusterEvents.map((event, index) => {
            return [event.createdTime, event.eventId]
        })
        clusterEventsId.sort((a, b) => {
            return (b[0] - a[0])
        })


        const location = clusterEvents.map((event, index) => {
            return {eventId: event.eventId, coords: event.coords}
        })

        const iconAndCount = tagCount.map((icon, index) => {
            return (
                (icon.count == 0) ? null
                :(
                    <View style={styles.tagPair} key={index}>
                        <Icon name={icon.tag} size={15} />
                        <Text>{icon.count}</Text>
                    </View>
                )
            )
        })
        
        const isSameLocation = (location.every((val, index, arr) => 
            (Math.floor(val.coords.latitude * 1000)== Math.floor(arr[0].coords.latitude * 1000)
                && Math.floor(val.coords.longitude * 1000) == Math.floor(arr[0].coords.longitude * 1000))
        ))

        this.tracksViewChanges = true

        const callOut = (isSameLocation && Platform.OS == 'ios') ? (
            <Callout onPress={() => this._onCallOutPress(clusterEventsId)}>
                <ScrollView  style={styles.splitContainer}>
                    {clusterEvents.map(data => (
                        <EventCallOutItem
                            key={data.eventId || data.likes.toString() + (Math.random()*100000).toString() +  (Math.random()*100000).toString()}
                            id={data.eventId}
                            icon={data.tag}
                            hostAvatar={data.hostAvatar}
                            likes={data.likes}
                            
                        />
                    ))

                    }
                </ScrollView>
            </Callout> 
        ) : null

        return (
          <Marker  coordinate={coordinate} key={key} onPress={() => this._onClusterPress(location ,onPress, clusterEventsId)}>

            <View style={styles.clusterContainer}>
                {iconAndCount}
            </View>
            {callOut}

          </Marker>
        )
    }

    _onClusterPress = (location, onPress, clusterEventsId) => {
        
        const isSameLocation = (location.every((val, index, arr) => 
            (Math.floor(val.coords.latitude * 1000)== Math.floor(arr[0].coords.latitude * 1000)
                && Math.floor(val.coords.longitude * 1000) == Math.floor(arr[0].coords.longitude * 1000))
        ))
        if (!isSameLocation){
            onPress()
            return
        }

        if (Platform.OS=='ios'){
            this.setState({mapPressed: false, markPressed: false, clusterPressed: true})
        } else {
            this._onCallOutPress(clusterEventsId)
        }
    }

    _onCallOutPress = (clusterEventsId) => {
        this.setState({markPressed: false, mapPressed: false, clusterPressed: false})
        Navigation.push(this.props.componentId, {
            component: {
                name: 'MultiEventDisplay',
                passProps: {
                    clusterEventsId: clusterEventsId
                }
            }
        })
    }

    renderMarker = (data) => {
        const coords = {latitude: data.coords._latitude, longitude: data.coords._longitude}
        return (
            
        <Marker
            coordinate={coords}
            key={data.key}
            onPress={() => {this.getPressedEvent(data.key)} }
            >       
            <CustomMarker icon={data.tag} hostAvatar={data.hostAvatar} likes={data.likes} />
        </Marker>
        )
    }



    animateToUserLocation = () => {
        const {userLocation} = this.state
        if (this.map && userLocation != {}){
            this.map.getMapRef().animateToRegion(userLocation)
        }
    }

    render(){

        const {markPressed, mapPressed, loading, initialLoad} = this.state

        let popUp = null 
        if (markPressed && !mapPressed){         
            const pressedEvent = this.state.pressedEvent
            if (pressedEvent){
                popUp = <PopUpWnd {...pressedEvent}  componentId={this.props.componentId} onPress={() => this.onPopUpPress()} />
            } else{
                popUp = null
            }
        } else {
            popUp = <View></View>
        }

        const loadingIndicator = (loading && initialLoad) ? <ActivityIndicator size={"large"} style={{zIndex: 1}}/> : null


        return(
            <View style={[styles.container]}>
                {loadingIndicator}
                <ClusteredMapView
                    style={styles.mapStyle}
                    minZoom = {1}
                    maxZoom = {20}
                    showsUserLocation={true}
                    moveOnMarkerPress={false}
                    showsMyLocationButton={true}
                    provider={PROVIDER_GOOGLE} 
                    customMapStyle={mapStyle}
                    data={this.props.mapEvents}
                    loadingEnabled={true}
                    initialRegion={INIT_REGION}
                    onPress={this.mapViewPressedHandler}
                    onMarkerPress={this.markPressedHandler}
                    onMapReady={(Platform.OS==='android') ? this.onMapReady : null}
                    ref={(r) => { this.map = r }}
                    renderMarker={this.renderMarker}
                    renderCluster={this.renderCluster} />
                {popUp}
                <View style={styles.searchBarContainer}>
                    <GooglePlaceAutoComplete
                        returnDetails={locationDetails => this.setState({locationDetails: locationDetails})}
                        location={this.state.userLocation}
                    />
                </View>

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
        position: (Platform.OS=='ios') ? 'absolute' : 'relative',
        zIndex: 0
    },
    clusterContainer:{
        flexDirection: 'row',
        minWidth: 45,
        height: 32,
        borderRadius: 45,
        backgroundColor: '#e67e22',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 2
    },
    tagPair:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 2,
        marginLeft: 2
    },
    splitContainer:{
        minWidth: 60,
        minHeight: 65,
        maxHeight: 150,
        backgroundColor: 'white',
        paddingHorizontal: 2
    },
    searchBarContainer:{
        bottom: (Platform.OS=='ios') ? '37%' : '88.5%' ,
        width: '100%',
        position: (Platform.OS=='ios') ? 'relative' : 'absolute'
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