// Page shows user settings

import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import firebase from 'react-native-firebase'
import  {Navigation} from 'react-native-navigation'

export default class Settings extends React.Component{
    static get options(){
        return{
            topBar:{
                title:{
                    text:'Profile',
                    alignment: 'center'
                },
                rightButtons:[
                    {
                        id: 'settingBtn',
                        text: 'Settings',
                        color: '0481fe'
                    }
                ],
            }
        }
    }

    constructor(props){
        super(props)
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({buttonId}){
        if(buttonId == "settingBtn"){
            Navigation.push(this.props.componentId, {
                component:{
                    name: 'Settings'
                }
            })
        }
    }


    render(){
        return(
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <TouchableOpacity style={styles.avatar}>
                    </TouchableOpacity>
                    <View style={styles.followContainer}>
                    <TouchableOpacity style={styles.followTouchBtn}>
                        <Text>follower</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.followTouchBtn}>
                        <Text>following</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.historyContainer}>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text>Created</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text>Liked</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text>Joined</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.historyDisplay}>

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#eee'
    },
    userContainer:{
        width: '100%',
        height: '30%',
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    historyContainer:{
        width: '100%',
        height: '70%',
        backgroundColor: 'yellow',
        alignItems: 'center'
    },
    avatar:{
        height: '45%',
        width: '23%',
        borderRadius: 50,
        backgroundColor: 'orange',
        marginBottom: 10
    },
    followContainer:{
        width: '60%',
        height: '35%',
        backgroundColor: 'grey',
        borderRadius: 10,
        flexDirection: 'row'
    },
    followTouchBtn:{
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followText:{
        color: '#CAD3C8'
    },
    optionContainer:{
        width: '90%',
        height: '10%',
        backgroundColor: 'green',
        borderRadius: 10,
        flexDirection: 'row',
        marginVertical: 7
    },
    optionBtn:{
        width: '33%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    historyDisplay:{
        width: '90%',
        height: '85%',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})