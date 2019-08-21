import React from 'react'
import {ScrollView, View} from 'react-native'
import EventDisplay from '../Components/EventDisplay'
import Fire from '../firebase/Fire'

export default class MultiEventDisplay extends React.Component{
    static get options() {
        return {
            bottomTabs: {
                visible: false,
                drawBehind: true
            }
        }
    }

    state = {
        eventData: []
    }
    componentDidMount(){
        this.getEventData()
    }

    getEventData = async () => {
        const {clusterEventsId} = this.props
        const {eventData} = await Fire.getEvents({size: clusterEventsId.length, start: 0, eventIdList: clusterEventsId })
        
        this.setState({eventData})
    }


    render(){
        const {eventData} = this.state
        console.log(eventData)
        return(
            <ScrollView style={{backgroundColor: 'white'}}>
                {eventData.map(data => (
                    <EventDisplay {...data} />
                ))}
            </ScrollView>
        )
    }
}