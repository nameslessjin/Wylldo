import React from 'react'
import {FlatList} from 'react-native'
import EventDisplay from '../Components/EventDisplay'


export default class ListEvents extends React.Component{
    
    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <EventDisplay {...item} componentId={this.props.componentId} />;

    render(){
        const  {...props} = this.props
        return(
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.props.events}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}
                {...props}
            />
        )
    }
}
