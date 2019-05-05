import React from 'react'
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Navigation} from 'react-native-navigation'

export default class PopUpWnd extends React.Component{

    state={
        heartPressed: false
    }

    onWindowPressed = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'SingleEvent',
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

        const heartBtn = <TouchableOpacity onPress={() => this.onHeartBtnPressed()}>
                            <Icon 
                                name={(this.state.heartPressed) ? 'md-heart' : 'md-heart-empty'} 
                                size={30}
                                color={(this.state.heartPressed) ? '#E91E63' : null}/>
                        </TouchableOpacity>

        let displayImage = null

        if (this.props.image){
            displayImage= (
                <View style={styles.imageContainer}>
                    <Image source={this.props.image} resizeMode='cover' style={styles.image} />
                </View>
            )
        } else{
            displayImage = null
        }

        return(
            <View style={styles.container}>
                <View style={styles.displayContainer}>
                    {displayImage}
                    <View style={(displayImage) ? styles.informationContainer : styles.informationContainerNoImg}>
                        <TouchableOpacity style={{height: '80%'}} onPress={() => this.onWindowPressed()}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', marginEnd: 5}}>Thur Apr 2 13:00</Text>
                            <Text style={styles.name}>{this.props.hostUsername}</Text>
                            <Text ellipsizeMode={"tail"} numberOfLines={2}>{this.props.description}</Text>
                            <Text style={styles.name}>Shawn</Text>
                            <Text style={styles.comment} ellipsizeMode={"tail"} numberOfLines={1} >Jinsen is the best person in the world, no in the whole universe.  He is a god.</Text>
                            <Text style={styles.name}>Wei</Text>
                            <Text style={styles.comment} ellipsizeMode={"tail"} numberOfLines={1}>Zack is bad dog.  I have never seen a dog as bad as zack is.  He is just terrible</Text>
                            <Text style={{color: 'grey', fontSize: 12}} >See {this.props.commentNum} more comments</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            {heartBtn}
                            <Text style={{fontSize:15, marginHorizontal:4, color: 'grey', marginBottom:1}}>{this.props.likes}</Text>
                            <Icon name={'md-share-alt'} size={30} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        width: "95%",
        height: "35%",
        backgroundColor: "white",
        borderRadius: 20,
        position: 'absolute',
        top: "64%",
        left: "2.5%" ,
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayContainer:{
        width: "90%",
        height: '87%',
        flexDirection: 'row'
    },
    informationContainer:{
        height: '100%',
        width: '60%',
    },
    informationContainerNoImg:{
        height: '100%',
        width: '100%',
    },
    buttonContainer:{
        width: '100%',
        height: "20%",
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    imageContainer:{
        height: '100%',
        backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderRadius: 20,
        marginEnd: 9
    },
    image:{
        width: "100%",
        height:'100%',
        backgroundColor: '#D8D8D8',
        borderRadius: 20,
    },
    name:{
        fontSize: 13,
        fontWeight: 'bold'
    },
    comment:{
        fontSize: 14,
    },
})