import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'

const {width} = Dimensions.get('window')
export default class SortListBtn extends React.Component{


    state = {
        following: false,
        fun: false,
        sport: false,
        buttons:[
            {name: 'Following', isSet: false},
            {name: 'Fun', isSet: false},
            {name: 'Sport', isSet: false},
            {name: 'Study', isSet: false}
        ]
    }


    _onButtonPress = (index) => {
        const {buttons} = this.state
        const {setSort} = this.props
        let updateButtons = buttons.map(btn => btn)
        if (index == 0){

            updateButtons[index].isSet = !buttons[index].isSet
            this.setState({buttons: updateButtons})
        } else {
            updateButtons[index].isSet = !buttons[index].isSet
            updateButtons.forEach((btn, btnIndex) => {
                if (btn.name != 'Following' && btnIndex != index ){
                    btn.isSet = false
                }
            })
            this.setState({buttons: updateButtons})
        }
        setSort(updateButtons)
        
    }


    render(){

        const buttons = this.state.buttons.map((button, index) => {
            return(
                <TouchableOpacity key={button.name} onPress={() => this._onButtonPress(index)}>
                    <View style={[styles.button, (button.isSet) ? {backgroundColor: '#FE4C4C'} : null ]}>
                        <Text 
                            adjustsFontSizeToFit 
                            style={[styles.text, (button.isSet) ? {color: 'white'} : null]} 
                        >
                            {button.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        })

        return(
            <View style={styles.container}>
                {buttons}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    button:{
        borderColor: '#FE4C4C',
        borderWidth: 1,
        backgroundColor: 'white',
        width: width * 0.23,
        height: width * 0.09,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontFamily: 'Jellee-Roman',
        color: '#FE4C4C'

    }

})