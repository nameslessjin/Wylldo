import {FlatList} from 'react-native'
import UserDisplay from './UserDisplay'
import React from 'react'

export default class ListUsers extends React.Component{
    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <UserDisplay {...item} componentId={this.props.componentId} currentUserAvatar = {this.props.currentUserAvatar}/>

    render(){
        const {...props} = this.props
        return(
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.props.userList}
                keyExtractor = {this._keyExtractor}
                renderItem={this.renderItem}
                {...props}
            />
        )
    }
}