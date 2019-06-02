import React from 'react'
import {ScrollView} from 'react-native'
import EventDisplay from '../Components/EventDisplay'
export default class SingleEvent extends React.Component{
    render(){
        return(
            //This screen display a single event after pressing on the popup in home page
            <ScrollView style={{backgroundColor: 'white'}}>
                <EventDisplay {...this.props} />
            </ScrollView>

        )
    }
}
