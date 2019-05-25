//Home page

import React from 'react'
import {View, StyleSheet, Platform, PermissionsAndroid} from 'react-native'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import mapStyle from '../UI/MapStyle'
import CustomMarker from '../Components/CustomMarker'
import PopUpWnd from '../Components/PopUpWnd'
import {connect} from 'react-redux'
import Fire from '../firebase/Fire'
import {getCurrentUser, getMapEvents} from '../store/actions/action.index'
import {goToAuth} from '../navigation'
import {Navigation} from 'react-native-navigation'

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
        pressedEvent: null
    }

    constructor(props){
        super(props)
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(this.tabChanged)
    }

    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {

        if (selectedTabIndex == 0 && unselectedTabIndex != 0){
            if(Fire.uid){
                this.getMapEventData().then(mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                })
            } else {
                goToAuth()
            }
        }
        else if (selectedTabIndex==2 && unselectedTabIndex != 2){
            if(Fire.uid){
                this.getCurrentUserData().then(currentUserData => {
                    this.props.onGetCurrentUser(currentUserData.data())
                })
            } else {
                goToAuth()
            }
        }

    }

    componentWillUnmount(){
        this.bottomTabEventListener.remove()
        super.componentWillUnmount()
    }

    componentDidMount(){
        if (Fire.uid){
            this.getCurrentUserData().then( currentUserData => {
                this.props.onGetCurrentUser(currentUserData.data());
                this.getMapEventData().then( mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                })
            })
            .catch(error => {
                console.log(error.message)
                goToAuth()
            })
        } else {
            goToAuth()
        }
    }


    // When mark is pressed.  This part it rendered twice.
    // shouldComponentUpdate(nextProps, nextState){
    //     return nextState.mapEventKey != this.state.mapEventKey
    // }

    getCurrentUserData = async () => {
        const currentUserData = await Fire.getUserData()
        return currentUserData
    }

    getMapEventData = async () => {
        const mapEventData = await Fire.getMapEvents()
        return mapEventData
    }

    mapViewPressedHandler = () => {
        this.setState({markPressed: false, mapPressed: true})
   

    }

    getPressedEvent = async (mapEventKey) =>{
        let pressedEventData = await Fire.getEventsWithId(mapEventKey)
        // console.log("make sure this doesn't go twice")
        pressedEventData = {
            ...pressedEventData,
            eventId: mapEventKey
        }
        this.setState({pressedEvent: pressedEventData})
    }

    markPressedHandler = () => {
        this.setState({markPressed: true, mapPressed: false})
        this.getPressedEvent(this.state.mapEventKey)
    }

    onMapReady = () =>{
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
                this.setState({paddingTop: 0})
            })
    }



    render(){
        const Markers = this.props.mapEvents.map(mapEvent => {
            const coordinate = {latitude: mapEvent.l.latitude, longitude: mapEvent.l.longitude}
            if (mapEvent.l !== null){
                return(
                    <Marker
                    coordinate={coordinate}
                    key={mapEvent.key}
                    onPress={() => this.setState({mapEventKey : mapEvent.key}) }
                    >       
                     
                    <CustomMarker icon={mapEvent.d.tag} hostAvatar={mapEvent.d.hostAvatar} likes={mapEvent.d.likes} />
                    </Marker>
                )
            }
        }) 

        let popUp = null 
        if (this.state.markPressed && !this.state.mapPressed){         
            const pressedEvent = this.state.pressedEvent
            if (pressedEvent){
                popUp = <PopUpWnd {...pressedEvent}  componentId={this.props.componentId}/>
            } else{
                popUp = null
            }
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