import {FlatList, StyleSheet} from 'react-native'
import React from 'react'
import ProfileEventDisplay from './ProfileEventDisplay'


export default class ProfileListEvents extends React.Component{

    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <ProfileEventDisplay {...item} componentId={this.props.componentId} />

    render(){
        const {...props} = this.props
        return(
            <FlatList
                showsVerticalScrollIndicator = {false}
                data={this.props.events}
                keyExtractor = {this._keyExtractor}
                renderItem={this.renderItem}
                style={styles.container}
                {...props}
            />
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#eee'
    }
})