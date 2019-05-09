import React from 'react'
import mapStyle from '../UI/MapStyle'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import {View} from 'react-native'
import CustomMarker from '../Components/CustomMarker'


export default class ShowMap extends React.Component{

    state={
        markerLocation:{
            latitude: this.props.coords.latitude,
            longitude: this.props.coords.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122
        }
    }

    render(){
        const marker = (<Marker
                        coordinate={this.props.coords}>
                        <CustomMarker icon={this.props.tag} hostAvatar={this.props.hostAvatar} likes={this.props.likes} />
                        </Marker>)
        return(
            <View style={{width: "100%", height: "100%", paddingTop: 0}}>
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.markerLocation}
                    customMapStyle={mapStyle}
                    style={{width:'100%', height:'100%'}}
                    >
                    {marker}
                    
                </MapView>
            </View>
        )
    }

}