import React, {Component} from 'react'
import {Platform, SafeAreaView, StyleSheet, DeviceEventEmitter, Text, View, Image} from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import geolib from 'geolib'

import Compass from './components/compass'

const locations = require('./locations.json')

function getClosestPint (location) {
  return locations[0]
  // FIXME: implement this

  // for (const location of locations) {

  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  compass: {
    position: 'absolute',
  },
  needle: {
    position: 'absolute'
  },
  distance: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
})

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = { heading: 0, pintHeading: null, pintDistance: null }
  }

  componentDidMount () {
    ReactNativeHeading.start(1)

    DeviceEventEmitter.addListener('headingUpdated', (data) => {
      this.setState({ heading: data.heading })
    })

    navigator.geolocation.watchPosition((position) => {
      const closestPint = getClosestPint(position.coords)
      const heading = geolib.getRhumbLineBearing(position.coords, closestPint)
      const distance = geolib.getDistanceSimple(position.coords, closestPint)

      this.setState({ pintHeading: heading, pintDistance: distance })
    })
  }

  render () {
    const { heading, pintHeading, pintDistance } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Compass heading={heading} targetHeading={pintHeading} />
        <Text style={styles.distance}>{pintDistance} meters</Text>
      </SafeAreaView>
    )
  }
}
