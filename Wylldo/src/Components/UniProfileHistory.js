import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, RefreshControl} from 'react-native'
import Fire from '../firebase/Fire'
import UniProfileListEvents from './UniProfileListEvents'


const SIZE = 8

export default class UniProfileHistory extends React.Component{

    state = {
        selectedOption: null,
        refreshing: false,
        loading: false,
        createdEvents: [],
        joinedEvents: [],
        likedEvents: [],
        profileEventPosition: null
    }

    componentDidMount(){
        this.setState({selectedOption: 'Liked'})
        this._OnRefresh('Liked')
    }

    onLikedPressed = () => {
        if (this.state.selectedOption != 'Liked'){
            this.setState({selectedOption: 'Liked'})
            this._OnRefresh('Liked')
        }
    }

    onJoinedPressed = () => {
        if (this.state.selectedOption != 'Joined'){
            this.setState({selectedOption: 'Joined'})
            this._OnRefresh('Joined')
        }
    }

    onCreatedPressed = () => {
        if (this.state.selectedOption != 'Created'){
            this.setState({selectedOption: 'Created'})
            this._OnRefresh('Created')
        }
    }

    getProfileEvents = async (type, startPosition) => {
        this.setState({refreshing: true})
        const {eventData, cursor} = await Fire.getProfileEvents({size: SIZE, start: startPosition, type: type, userId: this.props.userId})
        this.setState({refreshing: false, loading: false, profileEventPosition: cursor})
        return eventData
    }

    _OnRefresh = (type) => this.getProfileEvents(type).then(events => {

        switch(this.state.selectedOption){
            case 'Created':
                this.setState({createdEvents: events})
            case 'Joined':
                this.setState({joinedEvents: events})
            case 'Liked':
                this.setState({likedEvents: events})
        }
    }) .catch(error => console.log(error))

    _loadMore = () => {
        this.setState({loading: true})
        const {profileEventPosition} = this.state
        if (profileEventPosition){
            this.getProfileEvents(this.state.selectedOption, profileEventPosition).then(events => {

                switch(this.state.selectedOption){
                    case 'Created':
                        const updateCreatedEvents = this.state.createdEvents.concat(events)
                        this.setState({createdEvents: updateCreatedEvents})
                    case 'Joined':
                        const updateJoinedEvents = this.state.joinedEvents.concat(events)
                        this.setState({joinedEvents: updateJoinedEvents})
                    case 'Liked':
                        const updateLikedEvents = this.state.likedEvents.concat(events)
                        this.setState({likedEvents: updateLikedEvents})
                }
            })
            .catch(error => console.log(error))
        }
    }

    render(){
        LayoutAnimation.easeInEaseOut()

        let displayEvents = null
        if (this.state.selectedOption == 'Created'){
            displayEvents = this.state.createdEvents
        } else if (this.state.selectedOption == 'Liked'){
            displayEvents = this.state.likedEvents
        } else if (this.state.selectedOption == 'Joined'){
            displayEvents = this.state.joinedEvents
        }

        const type = this.state.selectedOption

        return (
            <View style={styles.historyContainer}> 
                <View style={styles.optionContainer}>
                    <TouchableOpacity 
                            style={ (this.state.selectedOption == 'Liked') ? styles.selectedoptionBtn : styles.optionBtn}
                            onPress={this.onLikedPressed}    
                        >
                            <Text adjustsFontSizeToFit style={(this.state.selectedOption == 'Liked') ? styles.selectedOptionsText : styles.optionsText}>Liked</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={(this.state.selectedOption == 'Joined') ? styles.selectedoptionBtn : styles.optionBtn}
                            onPress={this.onJoinedPressed}      
                        >
                            <Text adjustsFontSizeToFit style={(this.state.selectedOption == 'Joined') ? styles.selectedOptionsText : styles.optionsText}>Joined</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={(this.state.selectedOption == 'Created') ? styles.selectedoptionBtn : styles.optionBtn}
                            onPress={this.onCreatedPressed}  
                        >
                            <Text adjustsFontSizeToFit style={(this.state.selectedOption == 'Created') ? styles.selectedOptionsText : styles.optionsText}>Created</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.historyDisplay}>
                    <UniProfileListEvents
                        events = {displayEvents}
                        componentId = {this.props.componentId}
                        type = {type}
                        refreshControl = {
                            <RefreshControl
                                refreshing = {this.state.refreshing}
                                onRefresh={() => this._OnRefresh(this.state.selectedOption)}
                            />
                        }
                        onEndReached = {this._loadMore}
                        onEndReachedThreshold = {0.3}
                    />

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    historyContainer:{
        width: '100%',
        height: '70%',
        alignItems: 'center'
    },
    optionContainer:{
        width: '95%',
        height: '10%',
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        marginVertical: 7,
        justifyContent: 'space-evenly'
    },
    selectedoptionBtn:{
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE4C4C',
        borderRadius: 10,
    },
    optionBtn:{
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    selectedOptionsText:{
        color: 'white',
        fontWeight: 'bold'
    },
    optionsText:{
        fontWeight: 'bold'
    },
    historyDisplay:{
        width: '95%',
        height: '85%',
        alignItems: 'center',
        backgroundColor: 'white'
    },
})