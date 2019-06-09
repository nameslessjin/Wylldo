import React from 'react'
import UniProfile from '../Components/UniProfile'


export default class OtherProfile extends React.Component{
    static get options(){
        return{
            topbar: {
                title:{
                    text: 'Profile',
                    alignment: 'center'
                }
            },
            bottomTabs: {
                visible: false,
                drawBehind: true
            }

        }
    }

    render(){
        return(
            <UniProfile {...this.props}/>
        )
    }
}