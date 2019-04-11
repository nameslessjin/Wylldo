import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'

export default class Footer extends React.Component{


    state={
        heartPressed: false
    }

    onLocationBtnPressed = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'ShowMap',
                passProps:{
                    ...this.props
                }
            }
        })
    }

    onHeartBtnPressed = () => {
        this.setState(prevState => {
            return{
                heartPressed: !prevState.heartPressed
            }
        })
    }


    render(){
        let locationBtn = null
        if (this.props.coords.latitude){
            locationBtn = (<TouchableOpacity onPress={() => this.onLocationBtnPressed()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#3498db'}}>Location</Text> 
                          </TouchableOpacity>)
                           
        } else{
            locationBtn = (<Text style={{fontSize: 15, fontWeight: 'bold', color: '#7f8c8d'}}>Location</Text>)
        }


        const heartBtn = <TouchableOpacity onPress={() => this.onHeartBtnPressed()}>
                            <Icon 
                                name={(this.state.heartPressed) ? 'md-heart' : 'md-heart-empty'} 
                                size={30}
                                color={(this.state.heartPressed) ? '#E91E63' : null}/>
                        </TouchableOpacity>


        return(
            <View style={{backgroundColor: 'white', margin: 10}}>
                <View style={styles.timeLocationContainer}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', marginEnd: 5}}>Thur Apr 2 13:00</Text>
                    {locationBtn}
                </View>

                <View style={styles.buttonsContainer}>
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                        {heartBtn}
                        <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.props.likes}</Text>
                        <Icon name={'md-share-alt'} size={30} />
                    </View>
                    <TouchableOpacity style={styles.joinBtn}>
                        <Text style={{fontSize: 20, color:'white'}}>JOIN</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text style={styles.name}>{this.props.hostUsername}</Text>
                    <Text style={styles.comment}>{this.props.description}</Text>
                    <Text style={styles.name}>Shawn</Text>
                    <Text style={styles.comment}>Jinsen is the best</Text>
                    <Text style={styles.name}>Wei</Text>
                    <Text style={styles.comment}>Zack is bad dog</Text>
                    <Text style={{color: 'grey', fontSize: 12}} >See 5000 more comments</Text>
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
        marginTop: -13
    },
    buttonsContainer:{
        height: 40,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10
    },
    joinBtn:{
        backgroundColor: '#ff5e57',
        borderRadius: 5,
        width: '22%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }

})