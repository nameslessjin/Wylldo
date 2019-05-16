import React from 'react'
import {View, Text, StyleSheet, TextInput, Platform, Keyboard, TouchableWithoutFeedback} from 'react-native'
import PickImage from '../Components/ImagePicker'
import {Navigation} from 'react-native-navigation'
import PickTag from '../Components/PickTag'
import DatePicker from '../Components/DatePicker'
import GuestSetting from '../Components/GuestSetting'



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
            if (this.state.endTime > this.state.startTime){
                Navigation.push(this.props.componentId, {
                    component:{
                        name: 'AddMap',
                        passProps:{
                            description: this.state.description.trim(),
                            image: this.state.image,
                            tag: this.state.tag,
                            startTime: this.state.startTime,
                            endTime: this.state.endTime
                        }
                    }
                })
            } else{
                alert("End Time must be greater than Start Time")
            }
        }
    }

    state ={
        description: "",
        image: null,
        android: false,
        tag: 'md-beer'
    }


    render(){
        
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.ImgView}> 
                        <PickImage updateImage= {(updatedImg) => this.setState({image: updatedImg})} />         
                    </View>
                    <View style={styles.DescriptionView}> 
                        <Text style={styles.emptySpace} ></Text>
                        <TextInput
                            placeholder="I wylldo..."
                            multiline={true}
                            onChangeText={(text) => this.setState({description:text})}
                            onSubmitEditing={Keyboard.dismiss}
                        />
                    </View>
                    <View style= {(Platform.OS === 'android') ? styles.IconTagViewAndroid : styles.IconTagViewIOS }>
                        <PickTag defaultTag={this.state.tag} updateTag={(updatedTagName) => this.setState({tag: updatedTagName})} />
                    </View>
                    <DatePicker 
                        startTime={(startTime) => this.setState({startTime: startTime})} 
                        endTime={(endTime) => this.setState({endTime: endTime})}
                    />
                    <GuestSetting componentId={this.props.componentId}/>
                </View>
            </TouchableWithoutFeedback>


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
        borderColor: "#DDDED1",
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
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        padding: 3
    },
    IconTagViewIOS:{
        width: "100%",
        height: "6%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        paddingTop: 6
    },
})