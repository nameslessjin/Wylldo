import React from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class CustomCluster extends React.Component{

    redner(){
        const {tagCount} = this.props
        const iconAndCount = tagCount.map((icon, index) => {
            return (
                <View>
                    <Icon name={icon.tag} size={15} />
                    <Text>{icon.count}</Text>
                </View>
            )
        })


        return(
            <View style={styles.container}>
                {iconAndCount}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        width: 43,
        height: 32,
        borderRadius: 45,
        backgroundColor: '#e67e22',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagPair:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})