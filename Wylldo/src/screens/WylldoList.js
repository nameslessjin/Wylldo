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
            <View style={styles.container}>
                <ListEvents events={this.props.events} componentId={this.props.componentId} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        events: state.events.Events,
        currentUser: state.events.currentUser
    }
}


export default connect(mapStateToProps)(EventTable)

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white'
    }
})