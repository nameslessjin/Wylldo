//This page is a convinent instagram like viewing page that lists all correct events

import React from 'react'
import {View, StyleSheet, RefreshControl, LayoutAnimation, Text} from 'react-native'
import  {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import ListEvents from '../Components/ListEvents'
import {getEvents, loadMoreEvents, getMapEvents} from '../store/actions/action.index'
import Fire from '../firebase/Fire'
import { goToAuth } from '../navigation';

const DOC_NUM = 5

class WylldoList extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'What\'s Happening',
                    alignment: 'center'
                },
                rightButtons:[
                    {
                        id: 'addEvent',
                        text: 'Post',
                        color: '#0481fe'

                    }
                ]
            }
        }
    }

    
    constructor(props){
        super(props);
        Navigation.events().bindComponent(this);
        this.state = {
            loading: false,
            refreshing: false,
            userLocation: {}
        }
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(this.tabChanged)
    }

    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {
        if (selectedTabIndex == 1 && unselectedTabIndex != 1){
            if(Fire.uid){
                this._onRefresh()
            } else {
                goToAuth()
            }
        }
    }

    componentWillUnmount(){
        this.bottomTabEventListener.remove()
    }

    getMapEventData = async () => {
        const {latitude, longitude} = this.state.userLocation
        const userLocation = {latitude: latitude, longitude: longitude}
        const mapEventData = await Fire.getMapEvents(userLocation)
        return mapEventData
    }

    // componentWillUnmount(){
    //     navigator.geolocation.clearWatch(this.watchId)
    // }

    //This part actually load when the home page is launched
    shouldComponentUpdate(nextProps, nextState){
        return nextProps != this.props
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
                this.getMapEventData().then( mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                    this.getEventData().then(events => {this.props.onGetEvents(events)})
                })
                .catch(error => {console.log(error)}) 
            },
            error => console.log(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        )
    }

    getEventData = async (startPosition) => {
        this.setState({refreshing: true})
        const {eventData, cursor} = await Fire.getEvents({size: DOC_NUM, start: startPosition, eventIdList: this.props.mapEventIdList})
        this.startPosition = cursor
        this.setState({refreshing: false, loading: false})
        return eventData
    }

    _onRefresh = () => {
        // this.getMapEventData().then(mapEvents => {
        //     this.props.onGetMapEvents(mapEvents)
        //     this.getEventData().then(events => {this.props.onGetEvents(events)})
        // })
        this.findCoordinates()
    }

    //When swipe up, trigger to load more evens
    //this function is triggered twice frequently
    _loadMore = () => {
        this.setState({loading: true})
        if (this.startPosition){
            this.getEventData(this.startPosition).then(events => {
                this.props.onLoadMoreEvents(events)
            })
            .catch(error => (console.log(error.message)))
        }
        this.setState({refreshing: false, loading: false})
    }

    //once the "post" button is clicked, move to addevent screen page. (stack up from WylldoList screen)
    navigationButtonPressed({buttonId}){
        if (buttonId == "addEvent"){
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'AddEvent'
                }
            })
        }
    }


    render(){
        LayoutAnimation.easeInEaseOut()

        const eventDisplay = (this.props.events.length == 0) ? 
            (<Text style={styles.text} numberOfLines={2}>There is nothing going on currently.  Post your wylldo.  You can be the first!</Text>)
            : (
                <ListEvents 
                    events={this.props.events} 
                    componentId={this.props.componentId} 
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    onEndReached = {this._loadMore}
                    onEndReachedThreshold = {0.5}

                />
            )

        return(
            <View style={styles.container}>
                {/* passing all the event data from redux to listevent screen to further process list */}
                {eventDisplay}
            </View>
        )
    }
}


//get eventdata and currentuser data from redux though currentuser data doesn't seem to be used
const mapStateToProps = (state) => {
    return {
        events: state.events.Events,
        currentUser: state.events.currentUser,
        mapEventIdList: state.events.mapEventIdList
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetEvents: (events) => dispatch(getEvents(events)),
        onLoadMoreEvents: (events) => dispatch(loadMoreEvents(events)),
        onGetMapEvents: (mapEvents) => dispatch(getMapEvents(mapEvents))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WylldoList)

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white'
    },
    text:{
        fontStyle: 'italic',
        color: 'grey',
        fontSize: 15,
        marginTop: 20,
        marginHorizontal: 10
    },
})