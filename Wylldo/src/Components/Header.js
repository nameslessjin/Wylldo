import React from 'react'
import {StyleSheet, View, Text} from "react-native"


export default class Header extends React.Component{

    render(){
        console.log(this.props.name)
        return(
            <View style={styles.container}>
                <Text>{this.props.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height: 50,
        width:  "100%",
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})