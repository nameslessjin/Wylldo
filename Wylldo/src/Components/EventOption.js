import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal'
import Fire from '../firebase/Fire'



export default class EventOption extends React.Component{

    state={
        isOptionVisible: false,
        pickerOpacity: 0.4,
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps != this.props){
            this.setState({isOptionVisible: this.props.isOptionVisible})
        }
    }

    onBackdropPress = () => {
        this.setState({isOptionVisible: false})
    }

    onDeletePress = () => {
        console.log('Delete pressed')
        Fire.tryFunction(this.props.eventId)
    }

    render(){

        let deleteBtn = null
        if (Fire.uid === this.props.hostUserid){
            deleteBtn = (
                <TouchableOpacity style={[styles.optionBtnStyle]} onPress={this.onDeletePress}>
                <Text style={[styles.optionsTextStyle, {color: 'red'}]}>Delete</Text>
                </TouchableOpacity>
            )
        }

        return(

            <Modal
            backdropOpacity={0}
            isVisible={this.state.isOptionVisible}
            onBackdropPress={this.onBackdropPress}
            style={{justifyContent: 'flex-end', alignContent: 'center'}}
            >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.optionBtnStyle}>
                        <Text style={[styles.optionsTextStyle]}>Report</Text>
                    </TouchableOpacity>
                    {(Fire.uid === this.props.hostUserid) ? <View style={styles.breakLine}/> : null}
                    {deleteBtn}
                </View>
            </Modal>

        )
    }

}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 70,
        borderWidth: 0.5,
        borderColor: "#DDDED1",
    },
    optionsTextStyle:{
        fontSize: 20,
    },
    optionBtnStyle:{
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    breakLine:{
        borderBottomColor: "#DDDED1",
        borderBottomWidth: 1.5,
        width: '100%'
    }
})