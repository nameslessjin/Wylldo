import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'

export default class GuestSeeting extends React.Component{
    


    render(){


        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.subContainer}>
                    <Text style={styles.text}>Invite</Text>
                    <Text>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subContainer}> 
                    <Text style={styles.text}>View</Text>
                    <Text>Public</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: "100%",
        height: "6%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
    },
    subContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    text:{
        fontWeight: 'bold', 
        fontSize: 16, 
        marginRight: 10,
        marginLeft: 20,
    }
})