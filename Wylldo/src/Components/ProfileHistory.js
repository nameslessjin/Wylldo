import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, RefreshControl} from 'react-native'
import Fire from '../firebase/Fire'
import {connect} from 'react-redux'
import {getCreatedEvents, loadMoreCreatedEvents, 
        getLikedEvents, loadMoreLikedEvents,
        getJoinedEvents, loadMoreJoinedEvents
    } from '../store/actions/action.index'
import ProfileListEvents from '../Components/ProfileListEvents'
import {Navigation} from 'react-native-navigation'

const SIZE = 8

class ProfileHistory extends React.Component{

    state={
        selectedOption: null,
        refreshing: false,
        loading: false
    }

    constructor(props){
        super(props)
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(this.tabChanged)
    }

    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {
        if (selectedTabIndex == 2 && unselectedTabIndex != 2){
            this.setState({selectedOption: 'Liked'})
            this._onRefresh('Liked')
        }
    }

    componentWillUnmount(){
        this.bottomTabEventListener.remove()
    }

    onLikedPressed = () => {
        if (this.state.selectedOption != 'Liked'){
            this.setState({selectedOption: 'Liked'})
            this._onRefresh('Liked')
        }
    }

    onJoinedPressed = () => {
        if (this.state.selectedOption != 'Joined'){
            this.setState({selectedOption: 'Joined'})
            this._onRefresh('Joined')
        }
    }

    onCreatedPressed = () => {
        if (this.state.selectedOption != 'Created'){
            this.setState({selectedOption: 'Created'})
            this._onRefresh('Created')
        }
    }


    getProfileEvents = async (type, startPosition) => {
        this.setState({refreshing: true})
        const {eventData, cursor} = await Fire.getProfileEvents({size: SIZE, start: startPosition, type: type})
        this.profileEventPosition = cursor
        this.setState({refreshing: false, loading: false})
        return eventData
    }
    
    _onRefresh = (type) => this.getProfileEvents(type).then(events => {
        if (this.state.selectedOption == 'Created'){
            this.props.onGetCreatedEvents(events)
        } else if (this.state.selectedOption == 'Liked'){
            this.props.onGetLikedEvents(events)
        } else if (this.state.selectedOption == 'Joined'){
            this.props.onGetJoinedEvents(events)
        }
        
    })

    _loadMore = () => {
        this.setState({loading: true})
        if(this.profileEventPosition){
            this.getProfileEvents(this.state.selectedOption, this.profileEventPosition).then(events => {

                if (this.state.selectedOption == 'Created'){
                    this.props.onLoadMoreCreatedEvents(events)
                } else if (this.state.selectedOption == 'Liked'){
                    this.props.onLoadMoreLikedEvents(events)
                } else if (this.state.selectedOption == 'Joined'){
                    this.props.onLoadMoreJoinedEvents(events)
                }

            })
            .catch(error => console.log(error))
        }
        this.setState({refreshing: false, loading: false})
    }

    render(){
        LayoutAnimation.easeInEaseOut()

        let displayEvents = null
        if(this.state.selectedOption == 'Created'){
            displayEvents = this.props.createdEvents
        } else if (this.state.selectedOption == 'Liked'){
            displayEvents = this.props.likedEvents
        } else if (this.state.selectedOption == 'Joined'){
            displayEvents = this.props.joinedEvents
        }

        const type = this.state.selectedOption

        return(
            <View style={styles.historyContainer}>
                <View style={styles.optionContainer}>
                    <TouchableOpacity 
                        style={ (this.state.selectedOption == 'Liked') ? styles.selectedoptionBtn : styles.optionBtn}
                        onPress={this.onLikedPressed}    
                    >
                        <Text style={(this.state.selectedOption == 'Liked') ? styles.selectedOptionsText : styles.optionsText}>Liked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={(this.state.selectedOption == 'Joined') ? styles.selectedoptionBtn : styles.optionBtn}
                        onPress={this.onJoinedPressed}      
                    >
                        <Text style={(this.state.selectedOption == 'Joined') ? styles.selectedOptionsText : styles.optionsText}>Joined</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={(this.state.selectedOption == 'Created') ? styles.selectedoptionBtn : styles.optionBtn}
                        onPress={this.onCreatedPressed}  
                    >
                        <Text style={(this.state.selectedOption == 'Created') ? styles.selectedOptionsText : styles.optionsText}>Created</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.historyDisplay}>
                    <ProfileListEvents
                        events = {displayEvents}
                        componentId={this.props.componentId} 
                        type={type}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._onRefresh(this.state.selectedOption)}
                            />
                        }
                        onEndReached = {this._loadMore}
                        onEndReachedThreshold = {0.5}
                    />
                </View>
            </View>
        )
    }

    
}

const mapStateToProps = state => {
    return {
        createdEvents: state.events.createdEvents,
        likedEvents: state.events.likedEvents,
        joinedEvents: state.events.joinedEvents
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onGetCreatedEvents: (createdEvents) => dispatch(getCreatedEvents(createdEvents)),
        onLoadMoreCreatedEvents: (createdEvents) => dispatch(loadMoreCreatedEvents(createdEvents)),
        onGetLikedEvents: (likedEvents) => dispatch(getLikedEvents(likedEvents)),
        onLoadMoreLikedEvents: (likedEvents) => dispatch(loadMoreLikedEvents(likedEvents)),
        onGetJoinedEvents: (joinedEvents) => dispatch(getJoinedEvents(joinedEvents)),
        onLoadMoreJoinedEvents: (joinedEvents) => dispatch(loadMoreJoinedEvents(joinedEvents))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHistory)

const styles = StyleSheet.create({
    historyContainer:{
        width: '100%',
        height: '70%',
        alignItems: 'center'
    },
    optionContainer:{
        width: '90%',
        height: '10%',
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginVertical: 7,
        justifyContent: 'space-evenly'
    },
    optionBtn:{
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    selectedoptionBtn:{
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE4C4C',
        borderRadius: 10,
    },
    historyDisplay:{
        width: '90%',
        height: '85%',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    optionsText:{
        fontWeight: 'bold'
    },
    selectedOptionsText:{
        color: 'white',
        fontWeight: 'bold'
    }
})