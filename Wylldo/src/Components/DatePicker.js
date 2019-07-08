// a lot of things needed to be checked in this part to avoid potential bug
import React from 'react'
import {Platform, View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker"

const {height, width} = Dimensions.get('window')
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
            monthDate: null
        }
    }

    componentDidMount(){
        let chosenDate = new Date()
        this.startDateToString(chosenDate)
        this.maxStartDateTime()
    }

    showDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: true})
    }

    showTimePicker = () => {
        this.setState({isTimePickerVisible: true})
    }

    setMaxEndTime = (chosenDate) => {
        let maxEndTime = new Date(chosenDate)
        maxEndTime.setHours(23,59,59)
        this.setState({maxEndTime: maxEndTime})
    }

    hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false, isTimePickerVisible: false})
    }

    handleTimePicked = date => {
        this.hideDateTimePicker()
        if (this.state.startTime >= date){
            alert("End Time must be greater than Start Time")
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
        const dateInWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const day =  dateInWeek[chosenDate.getDay()]
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
        const startTimeString = hours + ":" + minutes + AM
        const monthDate = day + " " + month + " " + date 
        this.setState({startTimeString: startTimeString, startTime: chosenDate, monthDate: monthDate})
        this.endDateToString(chosenDate)
        this.props.startTime(chosenDate)
        this.setMaxEndTime(chosenDate)
    }

    render(){
        let startTimePicker = null
        let endTimePicker = null
        if(Platform.OS === 'android'){

            startTimePicker=(
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleDatePicked}
                    mode={'datetime'}
                    minimumDate={this.state.minStartDate}
                    maximumDate={this.state.maxStartDate}
                    date={this.state.startTime}
                />
            )

            endTimePicker = (
                <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleTimePicked}
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
                    minimumDate={this.state.minStartDate}
                    maximumDate={this.state.maxStartDate}
                    date={this.state.startTime}
                />
            )

            endTimePicker = (
                <DateTimePicker
                    isVisible={this.state.isTimePickerVisible}
                    onCancel={this.hideDateTimePicker}
                    onConfirm={this.handleTimePicked}
                    mode={'time'}
                    date={this.state.endTime}
                    minimumDate={this.state.startTime}
                    maximumDate={this.state.maxEndTime}
                />
            )
        }
    

        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.timeContainer} onPress = {this.showDateTimePicker}>
                    <Text style={styles.timeText}>{this.state.monthDate}</Text>
                    <Text style={styles.timeText}>From</Text>
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
        fontSize: 0.02 * height, 
        marginRight: 10,
        marginLeft: 20,
    },
    timeContainer:{
        flexDirection: 'row',
        alignItems:'center'
    }
})