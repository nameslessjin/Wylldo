import {FlatList} from 'react-native'
import CommentDisplay from '../Components/CommentDisplay'
import React from 'react'
export default class ListComment extends React.Component{
    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <CommentDisplay {...item} componentId={this.props.componentId} 
                                    event_description={this.props.event_description} 
                                    host_username={this.props.host_username}/>
    
    render(){
        // console.log(this.props)
        return(
            <FlatList
            showsVerticalScrollIndicator={false}
            data={this.props.comments}
            keyExtractor = {this._keyExtractor}
            renderItem={this.renderItem}
            {...this.props}
        />
        )
    }
}