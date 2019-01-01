import React, { Component } from 'react'
import { Text, SafeAreaView, Button } from 'react-native'
import styles from '../styles'

export default class SettingsScreen extends Component {
  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hello, World!</Text>
        <Text>Hi</Text>
        <Button title='Add location' onPress={this.userAddCurrentLocation} />
      </SafeAreaView>
    )
  }
}
