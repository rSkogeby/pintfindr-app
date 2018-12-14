import React, { Component } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, View, FlatList, Text } from 'react-native'
import Spacer from 'react-spacer'

import Storage from '../lib/storage'

const locations = require('../locations.json')

const styles = StyleSheet.create({
  item: {
    display: 'flex'
  }
})

function getLocation (id) {
  return locations.find(l => l.id === id)
}

function renderItem ({ item }) {
  const location = getLocation(item.venueId)
  const hhmm = item.date.substr(11, 5)

  return (
    <View style={styles.item}>
      <Text>{hhmm} - {location.venueName} £{(location.cheapestBeerPrice / 100).toFixed(2)}</Text>
    </View>
  )
}

export default class HistoryPage extends Component {
  constructor (props) {
    super(props)
    this.state = { visits: null }
  }

  async componentDidMount () {
    const iterator = Storage.values({ gte: 'visit.', lt: 'visit/' })
    const visits = []

    while (true) {
      const current = await iterator.next()
      if (current.done) break
      visits.push(current.value)
    }

    this.setState({ visits })
  }

  render () {
    const { visits } = this.state

    if (!visits) {
      return (
        <SafeAreaView>
          <Spacer height={20} />
          <ActivityIndicator size='large' />
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView>
        <FlatList renderItem={renderItem} data={visits} scrollEnabled />
      </SafeAreaView>
    )
  }
}
