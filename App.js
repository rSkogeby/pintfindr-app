import React, {Component} from 'react'
import {ActivityIndicator, Button, Platform, SafeAreaView, StyleSheet, DeviceEventEmitter, Text, View, Image} from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import geolib from 'geolib'
import Spacer from 'react-spacer'

import Compass from './components/compass'

const locations = require('./locations.json')

function getClosestPint (userLocation, blacklist) {
  let shortestDistance = Infinity
  let nearestLocation = null

  for (const location of locations) {
    if (blacklist.includes(location.id)) continue

    const distance = geolib.getDistanceSimple(userLocation, location)

    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestLocation = location
    }
  }

  return nearestLocation
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pintName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pintPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userHeading: 0,
      userLocation: null,
      visitedVenuesIds: [],
    }
  }

  componentDidMount () {
    ReactNativeHeading.start(1)

    DeviceEventEmitter.addListener('headingUpdated', (data) => {
      this.setState({ userHeading: data.heading })
    })

    navigator.geolocation.watchPosition((position) => {
      this.setState({ userLocation: position.coords })
    })
  }

  userDidDrinkPint = () => {
    const { userLocation, visitedVenuesIds } = this.state
    const closestLocation = getClosestPint(userLocation, visitedVenuesIds)
    this.setState({ visitedVenuesIds: [...visitedVenuesIds, closestLocation.id] })
  }

  render () {
    const { userHeading, userLocation, visitedVenuesIds } = this.state

    if (!userHeading || !userLocation) {
      return (
        <SafeAreaView style={styles.container}>
          <Spacer height={20} />
          <ActivityIndicator size='large' />
        </SafeAreaView>
      )
    }

    const closestLocation = getClosestPint(userLocation, visitedVenuesIds)
    const pintHeading = geolib.getRhumbLineBearing(userLocation, closestLocation)
    const pintDistance = geolib.getDistanceSimple(userLocation, closestLocation)

    return (
      <SafeAreaView style={styles.container}>
        <Spacer height={20} />
        <Compass heading={userHeading} targetHeading={pintHeading} />
        <Spacer height={20} />

        {pintDistance > 25 ? <>
          <Text>Walk</Text>
          <Text style={styles.distance}>{Math.round(pintDistance / 1.09361)} yards</Text>
          <Spacer height={20} />
          <Text>then drink a pint of</Text>
          <Text style={styles.pintName}>{closestLocation.cheapestBeerName}</Text>
          <Spacer height={20} />
          <Text>and pay</Text>
          <Text style={styles.pintPrice}>£{(closestLocation.cheapestBeerPrice / 100).toFixed(2)}</Text>
          <Spacer height={20} />
        </> : <>
          <Text>Go in to</Text>
          <Text style={styles.venueName}>{closestLocation.venueName}</Text>
          <Spacer height={20} />
          <Text>then drink a pint of</Text>
          <Text style={styles.pintName}>{closestLocation.cheapestBeerName}</Text>
          <Spacer height={20} />
          <Text>and pay</Text>
          <Text style={styles.pintPrice}>£{(closestLocation.cheapestBeerPrice / 100).toFixed(2)}</Text>
          <Spacer height={20} />
          <Button title="I've had the pint, next!" onPress={this.userDidDrinkPint} />
        </>}
      </SafeAreaView>
    )
  }
}
