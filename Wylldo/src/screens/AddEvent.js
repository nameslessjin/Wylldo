import React from 'react'
import {View, Text, StyleSheet, TextInput, Platform, Keyboard, TouchableWithoutFeedback, Dimensions} from 'react-native'
import ImagePicker from '../Components/ImagePicker'
import {Navigation} from 'react-native-navigation'
import PickTag from '../Components/PickTag'
import DatePicker from '../Components/DatePicker'
import GuestSetting from '../Components/GuestSetting'


const {height, width} = Dimensions.get('window')

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

    componentWillMount(){
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow)
    }

    componentWillUnmount(){
        this.keyboardDidShowSub.remove()
    }

    handleKeyboardDidShow = (event) => {
        const keyboardHeight = event.endCoordinates.height
        const componentHeight = height * 0.08
        if (Platform.OS == 'ios'){
            this.setState({inputHeight: componentHeight})
        }
    }


    navigationButtonPressed({buttonId}){
        if (buttonId == "addMap"){
            const {description, image, tag, startTime, endTime, viewType,
                inviteCount, resizedImage, invite_userId
            } = this.state
            if (description.trim() == ''){
                alert('Description cannot be empty')
                return
            }
            if (endTime > startTime){
                Navigation.push(this.props.componentId, {
                    component:{
                        name: 'AddMap',
                        passProps:{
                            description: description.trim(),
                            image: image,
                            tag: tag,
                            startTime: startTime,
                            endTime: endTime,
                            viewType: viewType,
                            inviteCount: inviteCount,
                            resizedImage: resizedImage,
                            invite_userId: invite_userId
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
        tag: 'md-beer',
        viewType: 'Public',
        inviteCount: 5,
        resizedImage: null,
        invite_userId: [],
        inputHeight: 0,
        Focus: false
    }

    onFocus = () => {
        this.setState({Focus: true})
    }

    onBlur = () => {
        this.setState({Focus: false})
    }

    render(){
        const {Focus, inputHeight} = this.state

        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, 
                        (Focus) ? {bottom: inputHeight} : null]}>
                    <View style={styles.ImgView}> 
                        <ImagePicker updateImage= {(updatedImg) => this.setState({image: updatedImg})} resizedImage = {(resizedImage) => this.setState({resizedImage: resizedImage})}/>         
                    </View>
                    <View style={styles.DescriptionView}> 
                        <Text style={styles.emptySpace} ></Text>
                        <TextInput
                            placeholder="I wylldo..."
                            multiline={true}
                            onChangeText={(text) => this.setState({description:text})}
                            maxLength={250}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                        />
                    </View>
                    <View style= {(Platform.OS === 'android') ? styles.IconTagViewAndroid : styles.IconTagViewIOS }>
                        <PickTag defaultTag={this.state.tag} updateTag={(updatedTagName) => this.setState({tag: updatedTagName})} />
                    </View>
                    <DatePicker 
                        startTime={(startTime) => this.setState({startTime: startTime})} 
                        endTime={(endTime) => this.setState({endTime: endTime})}
                    />
                    <GuestSetting 
                        componentId={this.props.componentId} 
                        inviteCount={(inviteCount) => this.setState({inviteCount: inviteCount})}
                        viewType={(viewType) => this.setState({viewType: viewType})}
                    />
                </View>
            </TouchableWithoutFeedback>


        )
    }
}




const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#eee",
        alignItems: "center",
    },
    ImgView:{
        height: '40%',
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
        padding: 15
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