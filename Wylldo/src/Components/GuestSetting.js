import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Picker, TouchableWithoutFeedback, Platform} from 'react-native'
import Modal from 'react-native-modal'
import {Navigation} from 'react-native-navigation'


export default class GuestSeeting extends React.Component{
    
    state={
        inviteCount: 5,
        inviteLabel: 'Choose the number of people you want to invite',
        isInviteVisible: false,
        pickerOpacity: 0.4,
        viewType: 'Public',
        isViewVisible: false,
        Custom:[]
    }

    onInvitePressed = () => {
        this.setState({isInviteVisible: true, pickerOpacity: 0.4})
    }
    onInviteConfirmPressed = () => {
        this.setState({isInviteVisible: false, pickerOpacity: 0})
        this.props.inviteCount(this.state.inviteCount)
    }
    onViewConfirmPressed = () => {
        this.setState({isViewVisible: false, pickerOpacity: 0})
        this.props.viewType(this.state.viewType)
    }   

    onModalHide = () => {
        if (this.state.viewType == 'Custom'){
            Navigation.push(this.props.componentId, {
                component:{
                    name: 'FollowerSelect'
                }
            })
        }
    }
    onViewPressed = () => {
        this.setState({isViewVisible: true, pickerOpacity: 0.4})
    }

    render(){

        const inviteOptions = (
            <Picker
                selectedValue={this.state.inviteCount}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({inviteCount: itemValue})
                }}
            >
                <Picker.Item label="1" value={1}/>
                <Picker.Item label="2" value={2}/>
                <Picker.Item label="3" value={3}/>
                <Picker.Item label="4" value={4}/>
                <Picker.Item label="5" value={5}/>
                <Picker.Item label="6" value={6}/>
                <Picker.Item label="7" value={7}/>
                <Picker.Item label="8" value={8}/>
                <Picker.Item label="9" value={9}/>
                <Picker.Item label="10" value={10}/>
            </Picker>    
        )

        const viewOptions = (
            <Picker
                selectedValue={this.state.viewType}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({viewType: itemValue})
                }}
            >
                <Picker.Item label="Public" value='Public'/>
                <Picker.Item label="My Followers" value='My Followers'/>
                <Picker.Item label="Custom" value='Custom'/>
            </Picker>
        )

        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.subContainer} onPress={this.onInvitePressed}>
                    <Text style={styles.text}>Invite</Text>
                    <Text>{this.state.inviteCount}</Text>
                </TouchableOpacity>
                <Modal 
                    isVisible={this.state.isInviteVisible}
                    backdropOpacity={this.state.pickerOpacity}    
                    onBackdropPress={this.onInviteConfirmPressed}
                >
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <TouchableWithoutFeedback onPress={this.onInviteConfirmPressed}>
                            <View style={{width: '100%', height: '60%'}}>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={ (Platform.OS === 'android') ? styles.pickerStyleAndroid : styles.pickerStyleIOS}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>The number of people you want to invite</Text>
                                <Text style={styles.titleText}>(Self-include)</Text>
                            </View>
                            {inviteOptions}
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.confirmButton}
                        underlayColor={"#ebebeb"}
                        onPress={this.onInviteConfirmPressed}
                    >
                        <Text style={styles.confirmTextStyle}>Confirm</Text>
                    </TouchableOpacity>
                </Modal>

                <TouchableOpacity style={styles.subContainer} onPress={this.onViewPressed}> 
                    <Text style={styles.text}>View</Text>
                    <Text>{this.state.viewType}</Text>
                </TouchableOpacity>

                <Modal 
                    isVisible={this.state.isViewVisible}
                    backdropOpacity={this.state.pickerOpacity}    
                    onBackdropPress={this.onViewConfirmPressed}
                    onModalHide={this.onModalHide}
                >
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <TouchableWithoutFeedback onPress={this.onViewConfirmPressed}>
                            <View style={{width: '100%', height: '60%'}}>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={ (Platform.OS === 'android') ? styles.pickerStyleAndroid : styles.pickerStyleIOS}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>Pick people to see your wylldo</Text>
                            </View>
                            {viewOptions}
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.confirmButton}
                        underlayColor={"#ebebeb"}
                        onPress={this.onViewConfirmPressed}
                    >
                        <Text style={styles.confirmTextStyle}>Confirm</Text>
                    </TouchableOpacity>
                </Modal>
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
    },
    confirmTextStyle:{
        fontSize: 20,
        color: '#007ff9',
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
    pickerStyleIOS:{
        backgroundColor: 'white',
        width: '100%',
        height: '40%',
        borderRadius: 13,
        marginBottom: 10
    },
    pickerStyleAndroid:{
        backgroundColor: 'white',
        width: '100%',
        height: '20%',
        borderRadius: 13,
        marginBottom: 10
    },
    confirmButton: {
        backgroundColor: "white",
        borderRadius: 13,
        height: 57,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: 'center',
    },
    titleText:{
        textAlign: 'center',
        color: '#8f8f8f',
        fontSize: 13
    },
    titleContainer:{
        borderBottomColor: '#d5d5d5',
        borderBottomWidth: 0.5,
        padding: 14,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    }
})