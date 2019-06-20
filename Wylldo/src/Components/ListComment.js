import {FlatList} from 'react-native'
import CommentDisplay from '../Components/CommentDisplay'
import React from 'react'
export default class ListComment extends React.Component{
    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <CommentDisplay {...item} componentId={this.props.componentId}/>
    
    render(){
        const {...props} = this.props
        return(
            <FlatList
            showsVerticalScrollIndicator={false}
            data={this.props.comments}
            keyExtractor = {this._keyExtractor}
            renderItem={this.renderItem}
            {...props} 
        />
        )
    }
}