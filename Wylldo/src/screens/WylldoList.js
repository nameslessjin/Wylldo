//This page is a convinent instagram like viewing page that lists all correct events

import React from 'react'
import {View, StyleSheet, RefreshControl, LayoutAnimation, Text, ActivityIndicator} from 'react-native'
import  {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import ListEvents from '../Components/ListEvents'
import {getEvents, loadMoreEvents, getMapEvents} from '../store/actions/action.index'
import Fire from '../firebase/Fire'
import { goToAuth } from '../navigation';
import SortListBtn from '../Components/SortListBtn'

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
            userLocation: {},
            sortButtons: [
                {name: 'Following', isSet: false},
                {name: 'Fun', isSet: false},
                {name: 'Sport', isSet: false}
            ],
            startPosition: null,
            initialLoad: true
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
        this.setState({loading: true})
        const sortOption = this._findSortType()
        // console.log('Sort: ', sortOption)
        const {latitude, longitude} = this.state.userLocation
        const userLocation = {latitude: latitude, longitude: longitude}
        const mapEventData = await Fire.getMapEvents(userLocation, sortOption)
        // console.log(mapEventData)

        return mapEventData
    }

    _findSortType = () => {
        const {sortButtons} = this.state
        let sortOption = sortButtons.map(btn => btn)
        const option = sortOption.find(option => {
                return (option.name !='Following' && option.isSet == true) || null
            })
        return (option) ? option.name : null
    }

    componentDidUpdate(prevProps, prevState){
        const prevSortButtons = prevState.sortButtons
        const sortButtons = this.state.sortButtons
        if (prevSortButtons != sortButtons){
            
            if (sortButtons[0].isSet == prevSortButtons[0].isSet){
                this._onRefresh()
            }

        }
    }

    _followingEvents = () => {
        const {events} = this.props
        
        const {following_list} = this.props.currentUser
        let eventList = [...events]
        console.log('ListProps: ', eventList)
        eventList = eventList.filter(event => {
            return ( following_list.find(userId => {
                return userId == event.hostUserId
            }))

        })
        
        // console.log('List: ', eventList)

        return eventList
        
    }

    // componentWillUnmount(){
    //     navigator.geolocation.clearWatch(this.watchId)
    // }

    //This part actually load when the home page is launched
    shouldComponentUpdate(nextProps, nextState){
        return (nextProps != this.props || nextState != this.state)
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
                // this.startPosition = null
                this.getMapEventData().then( mapEvents => {
                    this.props.onGetMapEvents(mapEvents)
                    this.getEventData().then(res => {
                        const {eventData, cursor} = res
                        console.log(res)
                        this.props.onGetEvents(eventData)
                        this.setState({startPosition: cursor, loading: false})
                    })
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
        this.setState({refreshing: false, initialLoad: false})
        return {eventData, cursor}
    }

    _onRefresh = () => {
        // this.getMapEventData().then(mapEvents => {
        //     this.props.onGetMapEvents(mapEvents)
        //     this.getEventData().then(events => {this.props.onGetEvents(events)})
        // })
        this.setState({startPosition: null})
        this.findCoordinates()
    }

    //When swipe up, trigger to load more evens
    //this function is triggered twice frequently
    _loadMore = () => {
        
        const {startPosition} = this.state
        if (startPosition){
            this.getEventData(startPosition).then(res => {
                const {eventData, cursor} = res
                this.props.onLoadMoreEvents(eventData)
                this.setState({startPosition: cursor})
            })
            .catch(error => (console.log(error.message)))
        }
    }

    //once the "post" button is clicked, move to addevent screen page. (stack up from WylldoList screen)
    navigationButtonPressed({buttonId}){
        if (buttonId == "addEvent"){
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'AddMap',
                    passProps: {
                        userLocation: this.state.userLocation
                    }
                }
            })
        }
    }

    setSort = (sortButtons) => {
        this.setState({sortButtons: sortButtons})
    }



    render(){
        LayoutAnimation.easeInEaseOut()
        const {isSet} = this.state.sortButtons[0]
        const events = (isSet) ? this._followingEvents() : this.props.events
        // console.log('Props: ', this.props.events)
        
        const eventDisplay = (this.state.loading) ? <ActivityIndicator size={'large'}/>
            : (events.length == 0) 
            ? (<Text adjustsFontSizeToFit style={styles.text} numberOfLines={2}>There is nothing going on in your region currently.  Be the first one to post your wylldo!</Text>)
            :   (

                    <ListEvents 
                        events={events} 
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
                <SortListBtn setSort={(buttons) => this.setSort(buttons)}/>
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
    sortButtonContainer:{
        width: '100%',
        height: 50,
        backgroundColor: 'grey',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})