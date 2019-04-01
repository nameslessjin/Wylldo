import React from 'react'
import {StyleSheet, FlatList,View} from 'react-native'
import EventDisplay from '../Components/EventDisplay'
import {Navigation} from 'react-native-navigation'

export default class ListEvents extends React.Component{
    
    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <EventDisplay {...item} />;

    render(){
        return(
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.props.events}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}
            
            />
        )
    }
}
