import React from 'react'
import {Navigation} from 'react-native-navigation'
import UnivProfile from '../Components/UniProfile'
import {connect} from 'react-redux'

class MainProfile extends React.Component{
    static get options(){
        return {
            topBar:{
                title:{
                    text: 'Profile',
                    alignment: 'center'
                },
                rightButtons: [
                    {
                        id: 'settingBtn',
                        text: 'Settings',
                        color: '0481fe'
                    }
                ]
            }
        }
    }

    constructor(props){
        super(props)
        Navigation.events().bindComponent(this)
        this.tabbed = false
        this.bottomTabEventListener = Navigation.events().registerBottomTabSelectedListener(this.tabChanged)
    }

    tabChanged = ({selectedTabIndex, unselectedTabIndex}) => {
        if (selectedTabIndex == 2 && unselectedTabIndex != 2){
            this.tabbed = true
        } else {
            this.tabbed = false
        }
    }

    componentWillUnmount(){
        this.bottomTabEventListener.remove()
    }

    navigationButtonPressed({buttonId}){
        if (buttonId == 'settingBtn'){
            Navigation.push(this.props.componentId, {
                component: {
                    name: 'Settings'
                }
            })
        }
    }

    render(){

        return(
            (this.tabbed) ? <UnivProfile {...this.props.currentUser} componentId={this.props.componentId} /> : null
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.events.currentUser
    }
}

export default connect(mapStateToProps, null)(MainProfile)