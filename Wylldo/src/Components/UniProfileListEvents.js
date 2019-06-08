import {FlatList, StyleSheet} from 'react-native'
import React from 'react'
import UniProfileEventDisplay from './UniProfileEventDisplay'


export default class UniProfileListEvents extends React.Component{

    _keyExtractor = (item, index) => (item.key + index).toString()
    renderItem = ({item}) => <UniProfileEventDisplay {...item} componentId={this.props.componentId} type={this.props.type} />

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
        backgroundColor: '#eee',
        height: '100%'
    }
})