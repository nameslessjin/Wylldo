//This page is a convinent instagram like viewing page that lists all correct events

import React from 'react'
import {View, StyleSheet, RefreshControl, LayoutAnimation} from 'react-native'
import  {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import ListEvents from '../Components/ListEvents'
import {getEvents, loadMoreEvents} from '../store/actions/action.index'
import Fire from '../firebase/Fire'
import { goToAuth } from '../navigation';



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
    }

    //This part actually load when the home page is launched
    componentDidMount(){
        if (Fire.uid){
            this._onRefresh()
        } else{
            goToAuth()
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps != this.props
    }

    getEventData = async (lastKey) => {

        
        this.setState({refreshing: true})

        const {eventData, cursor} = await Fire.getEvents({size: 3, start: lastKey})
        this.lastKnownKey = cursor
        
        this.setState({refreshing: false, loading: false})

        return eventData
    }

    _onRefresh = () => this.getEventData().then(events => {this.props.onGetEvents(events)})

    //When swipe up, trigger to load more evens
    //this function is triggered twice frequently
    //Current solution reduced the load size from 5 to 3
    _loadMore = () => {
        this.setState({loading: true})
        if (this.lastKnownKey){
            // console.log("make sure this doesn't go twice")
            this.getEventData(this.lastKnownKey).then(events => {
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
                    onEndReachedThreshold = {0.4}

                />
            </View>
        )
    }
}


//get eventdata and currentuser data from redux though currentuser data doesn't seem to be used
const mapStateToProps = (state) => {
    return {
        events: state.events.Events,
        currentUser: state.events.currentUser
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