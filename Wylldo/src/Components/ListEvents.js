import React from 'react'
import {StyleSheet, FlatList,View} from 'react-native'
import EventDisplay from '../Components/EventDisplay'
import {Navigation} from 'react-native-navigation'

export default class ListEvents extends React.Component{
    
    _keyExtractor = (item, index) => (item.key + index).toString()

    render(){
        {console.log(this.props.events)}
        return(
            <FlatList
                data={this.props.events}
                keyExtractor={this._keyExtractor}
                renderItem={(info) => (
                    console.log(info),
                    <EventDisplay
                        description={info.item.description}
                        key={info.item.key}
                        image={info.item.image}
                    />
                )}
            
            />
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: "100%"
        
    }
})