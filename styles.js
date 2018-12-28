import { StyleSheet } from 'react-native'

// Layout and formatting
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  compass: {
    position: 'absolute'
  },
  needle: {
    position: 'absolute'
  },
  distance: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  pintName: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  pintPrice: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

module.exports = styles
