// a lot of things needed to be checked in this part to avoid potential bug
import React from 'react'
import {Platform, View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker"


export default class DatePicker extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            minStartDate: new Date(),
            startTimeString: null,
            endTimeString: null,
            maxStartDate: null,
            isDateTimePickerVisible: false,
            isTimePickerVisible: false,
            minuteInterval: null,
            startTime: new Date(),
            endTime: null,
            maxEndTime: null,

        }
    }

    componentDidMount(){
        let chosenDate = new Date()
        this.startDateToString(chosenDate)
        chosenDate.setHours(23,59,59)
        this.endDateToString(chosenDate)
        this.maxStartDateTime()
        this.setState({minuteInterval: 10})
        this.setMaxEndTime()
        
    }

    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
    }

    showTimePicker = () => {
        this.setState({isTimePickerVisible: true})
    }

    setMaxEndTime = () => {
        let maxEndTime = this.state.startTime
        maxEndTime.setHours(23,59,59)
        this.setState({maxEndTime: maxEndTime})
    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false, isTimePickerVisible: false})
    }

    handleTimePicked = date => {
        console.log(this.state.startTime)
        this.hideDateTimePicker()
        console.log(date)
        if (this.state.startTime >= date){
            alert("Start Time must be larger than End Time")
        } else {
            this.endDateToString(date)
        }
    }

    handleDatePicked = date => {
        this.startDateToString(date)
        this.hideDateTimePicker()
    }
    
    maxStartDateTime = () => {
        let maxStartDate = new Date()
        maxStartDate.setDate(maxStartDate.getDate() + 14)
        maxStartDate.setHours(23,59,59)
        this.setState({maxStartDate: maxStartDate})
    }

    endDateToString = (chosenDate) => {
        let hours = chosenDate.getHours().toString()
        let minutes = chosenDate.getMinutes()
        let AM = "AM"
        if (minutes < 10){
            minutes = "0" + minutes
        }
        if (hours > 12){
            hours = hours - 12
            AM = "PM"
        }
        const endTimeString = hours + ":" + minutes + AM
        this.setState({endTimeString: endTimeString, endTime: chosenDate})
        this.props.endTime(chosenDate)
    }

    startDateToString = (chosenDate) => {
        const dateInWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"]
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const day = dateInWeek[chosenDate.getDay() - 1]
        const month = months[chosenDate.getMonth()]
        const date = chosenDate.getDate()
        let hours = chosenDate.getHours().toString()
        let minutes = chosenDate.getMinutes()
        let AM = "AM"
        if (minutes < 10){
            minutes = "0" + minutes
        }
        if (hours > 12){
            hours = hours - 12
            AM = "PM"
        }
        const startTimeString = day + " " + month + " " + date + " " + hours + ":" + minutes + AM
        this.setState({startTimeString: startTimeString, startTime: chosenDate})
        this.props.startTime(chosenDate)
    }

    render(){
        let startTimePicker = null
        let endTimePicker = null
        if(Platform.OS === "android"){

            startTimePicker=(
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleDatePicked}
                    mode={'datetime'}
                    // minuteInterval={this.state.minuteInterval}
                    minimumDate={this.state.minStartDate}
                    maximumDate={this.state.maxStartDate}
                    
                />
            )

            endTimePicker = (
                <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleTimePicked}
                    // minuteInterval={this.state.minuteInterval}
                    mode={'time'}
                    date={this.state.startTime}
                />
            )

        }else{
            startTimePicker = (
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleDatePicked}
                    mode={'datetime'}
                    // minuteInterval={this.state.minuteInterval}
                    minimumDate={this.state.minStartDate}
                    maximumDate={this.state.maxStartDate}
                />
            )

            endTimePicker = (
                <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleTimePicked}
                    // minuteInterval={this.state.minuteInterval}
                    mode={'time'}
                    minimumDate={this.state.startTime.setM}
                    maximumDate={this.state.maxEndTime}
                />
            )
        }
    

        return(
            <View style={styles.container}>
                <Text style={styles.timeText}>From</Text>
                <TouchableOpacity style={styles.timeContainer} onPress = {this.showDateTimePicker}>
                    <Text>{this.state.startTimeString}</Text>
                </TouchableOpacity>
                {startTimePicker}
                <Text style={styles.timeText}>To</Text>
                <TouchableOpacity style={styles.timeContainer} onPress ={this.showTimePicker}>
                <Text>{this.state.endTimeString}</Text>
                </TouchableOpacity>
                {endTimePicker}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: "100%",
        height: "6%",
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        borderColor: "#DDDED1",
    },
    timeText:{
        fontWeight: 'bold', 
        fontSize: 16, 
        marginRight: 10,
        marginLeft: 20,
    },
    timeContainer:{
        flexDirection: 'row',
        alignItems:'center'
    }
})