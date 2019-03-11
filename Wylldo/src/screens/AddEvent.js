import React from 'react'
import {View, Text, StyleSheet, TextInput, Platform} from 'react-native'
import PickImage from '../Components/ImagePicker'
import {Navigation} from 'react-native-navigation'
import PickTag from '../Components/PickTag'


export default class addEvent extends React.Component{

    static get options(){
        return{
            bottomTabs:{
                visible: false,
                drawBehind: true
            },
            topBar:{
                rightButtons:[
                    {
                        id: 'addMap',
                        text: 'Next',
                        color: '#0481fe'

                    }
                ]
            }
        }
    }

    constructor(props){
        super(props);
        Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}){
        if (buttonId == "addMap"){
            Navigation.push(this.props.componentId, {
                component:{
                    name: 'AddMap'
                }
            })
        }
    }

    state ={
        description: "",
        image: null,
        android: false,
        tag: null
    }

    render(){
        
        return(
            <View style={styles.container}>
                <View style={styles.ImgView}> 
                    <PickImage/>         
                </View>
                <View style={styles.DescriptionView}> 
                    <Text style={styles.emptySpace} ></Text>
                    <TextInput
                        placeholder="I wylldo..."
                        multiline={true}
                        onChangeText={(text) => this.setState({description:text})}
                    />
                </View>
                <View style= {(Platform.OS === 'android') ? styles.IconTagViewAndroid : styles.IconTagViewIOS }>
                    <PickTag />
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#eee",
        alignItems: "center"
    },
    ImgView:{
        height: "39%",
        width: "100%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1"
    },
    DescriptionView:{
        height: "16%",
        width: "100%",
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        padding: 10
    },
    IconTagViewAndroid:{
        width: "100%",
        height: "6%",
        backgroundColor: "white",
        marginTop: 0.5,
        padding: 3
    },
    IconTagViewIOS:{
        width: "100%",
        height: "6%",
        backgroundColor: "white",
        marginTop: 0.5,
        paddingTop: 6
    }
})