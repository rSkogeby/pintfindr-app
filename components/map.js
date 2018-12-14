import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const locations = require('../locations.json')

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})

export default class MapScreen extends Component {
  render () {
    return (
      <MapView style={styles.map}>
        {locations.map(location => (
          <Marker coordinate={location} title={location.name} />
        ))}
      </MapView>
    )
  }
}
