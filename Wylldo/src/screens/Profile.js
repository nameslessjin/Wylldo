import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import firebase from 'react-native-firebase'
import  {Navigation} from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import PickAvatar from '../Components/PickAvatar';
import {connect} from 'react-redux'

class Profile extends React.Component{
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

    state={}


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
                    <PickAvatar updateAvatar={(updateAvat) => this.setState({avatar: updateAvat})} />
                    <View style={styles.followContainer}>
                    <TouchableOpacity style={styles.followTouchBtn}>
                        <Text style={styles.followNum}>1000</Text>
                        <Text style={styles.followText}>followers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.followTouchBtn}>
                        <Text style={styles.followNum}>0</Text>
                        <Text style={styles.followText}>following</Text>
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

const mapStateToProps = state => {
    return {
        currentUserData: state.events.currentUser
    }
}

export default connect(mapStateToProps)(Profile)

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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    historyContainer:{
        width: '100%',
        height: '70%',
        backgroundColor: 'yellow',
        alignItems: 'center'
    },
    followContainer:{
        width: '60%',
        height: '35%',
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
        color: '#bdc3c7',
        fontSize: 15
    },
    followNum:{
        fontSize: 20,
    },  
    optionContainer:{
        width: '95%',
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
        width: '95%',
        height: '85%',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})