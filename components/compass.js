import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'

const compass = require('../assets/compass.png')
const needle = require('../assets/needle.png')

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
  },
  compass: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: 300,
  },
  needle: {
    position: 'absolute',
    top: 12,
    left: 133,
    width: 34,
    height: 276,
  },
})

export default class Compass extends Component {
  render () {
    const { heading, targetHeading } = this.props

    return (
      <View style={styles.container}>
        <Image style={[styles.compass, { transform: [{ rotateZ: `${0 - heading}deg` }] }]} source={compass} />
        <Image style={[styles.needle, { transform: [{ rotateZ: `${targetHeading - heading}deg` }] }]} source={needle} />
      </View>
    )
  }
}
