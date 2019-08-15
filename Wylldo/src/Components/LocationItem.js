import React, {PureComponent} from 'react'
import {Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class LocationItem extends PureComponent {
    
    _locationPress = async() => {
        const res = await this.props.fetchDetails(this.props.place_id)
        this.props.returnDetails(res)

    }

    render () {
        return (
            <TouchableOpacity style={styles.root} onPress={this._locationPress}>
                <Text adjustsFontSizeToFit >{this.props.description}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:  "#DDDED1",
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5
    }
})