// Import libraries
import React, {Component} from 'react'
import {AsyncStorage, Alert, ActivityIndicator, Button, Platform, PermissionsAndroid, SafeAreaView, StyleSheet, DeviceEventEmitter, Text, View, Image} from 'react-native'
import ReactNativeHeading from 'react-native-heading'
import geolib from 'geolib'
import Spacer from 'react-spacer'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'

// Import image components
import Compass from './components/compass'
import HistoryScreen from './components/history'
import SettingsScreen from './components/settings'
import MapScreen from './components/map'

import Storage from './lib/storage'

// Pub locations
const locations = require('./locations.json')
const uuidv1 = require('uuid/v1') // Timestamp UUID (v1)
const uuidv4 = require('uuid/v4') // Random UUID (v4)

// 
const TabBarBookmark = require('./assets/TabBar_Bookmark.png')
const TabBarMore = require('./assets/TabBar_More.png')
const TabBarFeatured = require('./assets/TabBar_Featured.png')

// Gets object of closest venue that have not been visited
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

// Layout and formatting
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

// HomeScreen class
class HomeScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userHeading: 0,
      userLocation: null,
      visits: null,
      showHistory: false,
    }
  }
  // HomeScreen class: initialize values on home screen 
  async componentDidMount () {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }
    
    ReactNativeHeading.start(1)

    // HomeScreen class init: Direction of next location
    DeviceEventEmitter.addListener('headingUpdated', (data) => {
      this.setState({ userHeading: typeof data === 'number' ? data : data.heading })
    })

    // HomeScreen class init: Current position
    navigator.geolocation.watchPosition((position) => {
      this.setState({ userLocation: position.coords })
    })

    // HomeScreen class init: 
    const iterator = Storage.values({ gte: 'visit.', lt: 'visit/' })
    const visits = []

    while (true) {
      const current = await iterator.next()
      console.log(current)
      if (current.done) break
      visits.push(current.value)
    }

    // for await (const visit of iterator) {
    //   visits.push(visit.venueId)
    // }

    this.setState({ visits })
  }

  userDidDrinkPint = async () => {
    const { userLocation, visits } = this.state
    const closestLocation = getClosestPint(userLocation, visits.map(visit => visit.venueId))
    this.setState({ visits: [...visits, closestLocation.id] })

    const { latitude, longitude } = userLocation

    const date = (new Date()).toISOString()
    const visit = { date, venueId: closestLocation.id, latitude, longitude }

    await Storage.set(`visit.${date}`, visit)
  }

  showLocation = () => {
    const { userLocation } = this.state
    Alert.alert(`Current location:`, `${userLocation.latitude},${userLocation.longitude}`)
  }

  render () {
    const { userHeading, userLocation, visits, showHistory } = this.state

    if (!userHeading || !userLocation || !visits) {
      return (
        <SafeAreaView style={styles.container}>
          <Spacer height={20} />
          <ActivityIndicator size='large' />
        </SafeAreaView>
      )
    }

    const closestLocation = getClosestPint(userLocation, visits.map(visit => visit.venueId))
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

        <Button title='Show location' onPress={this.showLocation} />
      </SafeAreaView>
    )
  }
}

/*Creates bottom navigation bar for iPhone*/
const AppNavigator = createBottomTabNavigator(
  {
    History: {
      tabBarIcon: <Image source={TabBarBookmark} />,
      screen: HistoryScreen,
    },
    Home: {
      tabBarIcon: <Image source={TabBarMore} />,
      screen: HomeScreen,
    },
    Map: {
      screen: MapScreen,
    },
    Settings: {
      tabBarIcon: <Image source={TabBarFeatured} />,
      screen: SettingsScreen,
    },
  },
  {
    initialRouteName: 'Home'
  }
)

// Disable warnings in app
console.disableYellowBox = true;

// Swipe-up / drag-down settings menu:
/*  1. Settings
    2. About the app
    3. History
*/ 

/* Idea: access screens by swiping instead, 
e.g. map swipe right, awards swipe left 
*/

/* Allow user to add location to JSON file
   "id": "db7e73fc-65be-48a0-89aa-703d0f2792ce",
    "venueName": "Young's The King's Arms",
    "cheapestBeerName": "Young's Bitter",
    "cheapestBeerStyle": "Pale Ale",
    "cheapestBeerPrice": 395,
    "cheapestBeerBrewery": "Young's",
    "latitude": 51.7549394182251,
    "longitude": -1.25437871306325

    Generate timestamp dependant UUID with uuidv1(): outputs string to console
    Generate random UUID with uuidv4()

*/    
userAddCurrentLocation = async () => {
  
  // Implement form
  const venueName = 'Do venue'
  const cheapesterBeerName = 'Do beer name'
  const cheapestBeerStyle = 'Do beer style'
  const cheapestBeerPrice = 395
  const cheapestBeerBrewery = 'Do brewery'
  const { userLocation } = this.state

  // Save entries to dict
  locations_entry = [{
    "id": uuidv4(),
    "venueName": venueName,
    "cheapestBeerName": cheapesterBeerName,
    "cheapestBeerStyle": cheapestBeerStyle,
    "cheapestBeerPrice": cheapestBeerPrice,
    "cheapestBeerBrewery": cheapestBeerBrewery,
    "latitude": userLocation.latitude,
    "longitude": userLocation.longitude
  }]
}
  /*
  const { userLocation, visits } = this.state
  const closestLocation = getClosestPint(userLocation, visits.map(visit => visit.venueId))
  this.setState({ visits: [...visits, closestLocation.id] })

  const { latitude, longitude } = userLocation

  const date = (new Date()).toISOString()
  const visit = { date, venueId: closestLocation.id, latitude, longitude }

  await Storage.set(`visit.${date}`, visit)

/*

export default createAppContainer(AppNavigator)
