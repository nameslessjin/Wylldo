//This page is a convinent instagram like viewing page that lists all correct events

import React from 'react'
import {View, StyleSheet, RefreshControl, LayoutAnimation} from 'react-native'
import  {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import ListEvents from '../Components/ListEvents'
import {getEvents, loadMoreEvents} from '../store/actions/action.index'
import Fire from '../firebase/Fire'
import { goToAuth } from '../navigation';

const DOC_NUM = 5

class EventTable extends React.Component{

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
            refreshing: false
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
        super.componentWillUnmount()
    }

    //This part actually load when the home page is launched
    shouldComponentUpdate(nextProps, nextState){
        return nextProps != this.props
    }

    getEventData = async (startPosition) => {
        this.setState({refreshing: true})
        const {eventData, cursor} = await Fire.getEvents({size: DOC_NUM, start: startPosition, eventIdList: this.props.mapEventIdList})
        this.startPosition = cursor
        this.setState({refreshing: false, loading: false})
        return eventData
    }

    _onRefresh = () => this.getEventData().then(events => {this.props.onGetEvents(events)})

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
        return(
            <View style={styles.container}>
                {/* passing all the event data from redux to listevent screen to further process list */}
                <ListEvents 
                    events={this.props.events} 
                    componentId={this.props.componentId} 
                    refreshControl= {
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    onEndReached = {this._loadMore}
                    onEndReachedThreshold = {0.5}

                />
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
        onLoadMoreEvents: (events) => dispatch(loadMoreEvents(events))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventTable)

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white'
    }
})