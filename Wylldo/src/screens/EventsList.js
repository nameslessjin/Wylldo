//Page represent events

import React from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import  {Navigation} from 'react-native-navigation'
import {connect} from 'react-redux'
import ListEvents from '../Components/ListEvents'


class EventTable extends React.Component{

    static get options(){
        return{
            topBar:{
                title:{
                    text: 'What\'s Happening',
                    alignment: 'center'
                },
                rightButtons:[
                    {
                        id: 'addEvent',
                        text: 'Wylldo',
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


    state = {
        Events: []
    }



    componentDidAppear(){
        this.setState({Events: this.props.events})
        
    }

    navigationButtonPressed({buttonId}){
        if (buttonId == "addEvent"){
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'AddEvent'
                }
            })
        }
    }

    render(){

        return(
            <ListEvents events={this.state.Events}/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        events: state.events.Events
    }
}


export default connect(mapStateToProps)(EventTable)

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    }
})