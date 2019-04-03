import React from 'react'
import {StyleSheet, View, Text} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'

export default class Footer extends React.Component{

    render(){


        return(
            <View style={{backgroundColor: 'white', margin: 7}}>
                <View style={styles.timeLocationContainer}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Thur Apr 2 13:00</Text>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: '#3498db'}}>Location</Text>
                </View>
                <View>
                    <Text style={styles.name}>{this.props.name}</Text>
                    <Text style={styles.comment}>{this.props.description}</Text>
                    <Text style={styles.name}>Shawn</Text>
                    <Text style={styles.comment}>Jinsen is the best</Text>
                    <Text style={{color: 'grey', fontSize: 12}} >View 5000 more comments</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    name:{
        fontSize: 13,
        fontWeight: 'bold'
    },
    comment:{
        fontSize: 14,
    },
    timeLocationContainer:{
        height: 40,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10
    }

})