import React from 'react'
import {View, Text, StyleSheet, TextInput, Platform, PermissionsAndroid, Keyboard, TouchableWithoutFeedback, Dimensions, ScrollView} from 'react-native'
import ImagePicker from '../Components/ImagePicker'
import {Navigation} from 'react-native-navigation'
import PickTag from '../Components/PickTag'
import DatePicker from '../Components/DatePicker'
import GuestSetting from '../Components/GuestSetting'
import LocationPicker from '../Components/LocationPicker'
import {connect} from 'react-redux'
import {postEvent} from '../store/actions/action.index'
import Fire from '../firebase/Fire'



const {height, width} = Dimensions.get('window')

class addEvent extends React.Component{

    static get options(){
        return{
            bottomTabs:{
                visible: false,
                drawBehind: true
            },
            topBar:{
                rightButtons:[
                    {
                        id: 'Post',
                        text: 'Post',
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
        const componentHeight = height * 0.085
        if (Platform.OS == 'ios'){
            this.setState({inputHeight: componentHeight})
        }

        if (Platform.OS == 'android'){
            this.setState({inputHeight: componentHeight})
        }
    }


    navigationButtonPressed({buttonId}){
        if (buttonId == "Post"){
            const {description, image, tag, startTime, endTime, viewType,
                inviteCount, resizedImage, invite_userId
            } = this.state
            if (description.trim() == ''){
                alert('Description cannot be empty')
                return
            }
            const location = this.setLocation()
            // console.log(location)
            const {username, display_name, avatarUri, follower_list} = this.props.currentUserData
            const eventTag = (tag == 'md-beer') 
                            ? 'Fun' 
                            : (tag == 'md-american-football') 
                            ? 'Sport' 
                            : (tag == 'md-book')
                            ? 'Study'
                            : null
            if (endTime > startTime){
                const eventInfo = {
                    description: description.trim(),
                    tag: tag,
                    startTime: startTime,
                    endTime: endTime,
                    viewType: viewType,
                    inviteCount: inviteCount,
                    resizedImage: resizedImage,
                    invite_userId: invite_userId,
                    hostUsername: username,
                    host_display_name: display_name,
                    hostAvatar: avatarUri.storageLocation,
                    // host_follower_list: follower_list,
                    hostUserId: Fire.uid,
                    coords: (location) ? location.coords : null,
                    location: location,
                    eventTag: eventTag,
                }

                const uploadImage = image
                const uploadResizedImage = resizedImage
                this.createEvent(eventInfo, uploadImage, uploadResizedImage).then(newEvent => {
                    this.props.onPostEvent(newEvent)
                })
                .catch(err => console.error(err))

                Navigation.popToRoot(this.props.componentId)

            } else{
                alert("End Time must be greater than Start Time")
            }
        }
    }

    state = {
        description: "",
        image: null,
        android: false,
        tag: 'md-beer',
        viewType: 'Public',
        inviteCount: 5,
        resizedImage: null,
        invite_userId: [],
        inputHeight: 0,
        Focus: false,
    }

    createEvent = async (eventInfo, image, resizedImage) => {
        // console.log(eventInfo)
        const eventData = await Fire.addEvent(eventInfo, image, resizedImage)
        return eventData
    }

    setLocation = () => {
        const {pinLocation, searchLocation} = this.props
        let location = pinLocation
        // console.log(pinLocation)
        // console.log(searchLocation)
        if (location){
            if (searchLocation){
                if (pinLocation.coords.latitude == searchLocation.coords.latitude
                    && pinLocation.coords.longitude == searchLocation.coords.longitude){
                    location = searchLocation
                }
            }
        } else if (searchLocation){
            location = searchLocation
        }
        return location

    }

    onFocus = () => {
        this.setState({Focus: true})
    }

    onBlur = () => {
        this.setState({Focus: false})
    }

    render(){
        const {Focus, inputHeight, image} = this.state
        const {searchLocation, pinLocation} = this.props

        let imageViewHeight = null
        if (image){
            imageViewHeight = image.height/image.width* width
        }
        // console.log(imageViewHeight)
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={[styles.container, 
                        (Focus) ? {bottom: inputHeight} : null]}>
                    <View style={[styles.ImgView,
                        (imageViewHeight) ? (imageViewHeight <= 450) ? {height: (imageViewHeight)}
                            : {height: '60%'}
                        : {height: '40%'},
                        (Focus || !imageViewHeight) ? {height: '40%'} : (imageViewHeight <= 450) ? {height: (imageViewHeight)}
                            : {height: '60%'}
                    ]}> 
                        <ImagePicker updateImage= {(updatedImg) => this.setState({image: updatedImg})} resizedImage = {(resizedImage) => this.setState({resizedImage: resizedImage})}/>         
                    </View>
                    <View style={styles.DescriptionView}> 
                        <Text style={styles.emptySpace} ></Text>
                        <TextInput
                            placeholder="I will... (more detailed location and description)"
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

                    <LocationPicker
                        pinLocation={pinLocation}
                        searchLocation={searchLocation}
                    />

                    <DatePicker 
                        startTime={(startTime) => this.setState({startTime: startTime})} 
                        endTime={(endTime) => this.setState({endTime: endTime})}
                    />
                    <GuestSetting 
                        componentId={this.props.componentId} 
                        inviteCount={(inviteCount) => this.setState({inviteCount: inviteCount})}
                        viewType={(viewType) => this.setState({viewType: viewType})}
                    />
                    
                </ScrollView>
            </TouchableWithoutFeedback>


        )
    }
}

const mapStateToProps = state => {
    return {
        currentUserData: state.events.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onPostEvent: (eventInfo) => dispatch(postEvent(eventInfo))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(addEvent)


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#eee",
        alignItems: "center",
        height: '100%',
        width: '100%'
    },
    ImgView:{
        height: '40%',
        width: "100%",
        maxHeight: height * 0.52,
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
        height: "8%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        padding: 3
    },
    IconTagViewIOS:{
        width: "100%",
        height: "8%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
        paddingTop: 6
    },
})