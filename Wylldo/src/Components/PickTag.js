import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import {View, TouchableOpacity, StyleSheet, Keyboard, Text, Dimensions} from 'react-native'

const {height, width} = Dimensions.get('window')
export default class PickTag extends React.Component{

    state={
        icons:[
            {name: 'md-beer', tagged: true, description: 'Fun'},
            {name: 'md-american-football', tagged: false, description: 'Sport'},
            // {name: 'md-book', tagged: false},
        ]
    }

    pressTagHandler = (index) => {
        Keyboard.dismiss()
        let newIcons = this.state.icons.filter(() => {
            return true
        })
        newIcons.map((newIcon, newIndex)=>( newIcon.tagged = (newIndex == index) ? true : false ))
        this.setState({icons: newIcons})

        updatedIcon = this.state.icons.filter((icon) => {
            return icon.tagged === true
        })
        this.props.updateTag(updatedIcon[0].name)
    }

    render(){

        icons = this.state.icons.map((icon,index) => {
            return(
                <TouchableOpacity key={icon.name} onPress={() =>this.pressTagHandler(index)} >
                    <View style={styles.iconContainer}>
                        <Icon name={icon.name} size={0.04 * height} style={icon.tagged ? styles.taggedIcon : null} />
                        <Text 
                            adjustsFontSizeToFit
                            style={[styles.textStyle,icon.tagged ? styles.taggedText : null]}>
                            {icon.description}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        })

        return (
            <View style={styles.container}>
                {icons}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    iconContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    taggedIcon:{
        color: "#4295E8"
    },
    textStyle:{
        fontSize: 0.013 * height
    }, 
    taggedText:{
        color: "#4295E8"
    }
})