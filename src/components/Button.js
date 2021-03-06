import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native'

const window = Dimensions.get('window')
const buttonWidth = window.width / 4

export const Button = ({ size, text, theme, onPress }) => {
  const buttonStyles = [styles.button]
  const buttonText = [styles.buttonText]

  if (size === 'long') {
    buttonStyles.push(styles.longButton)
  }

  if (theme === 'operator') {
    buttonStyles.push(styles.buttonOperator)
  } else if (theme === 'additional') {
    buttonStyles.push(styles.buttonAdditional)
  }

  return (
    <TouchableOpacity style={buttonStyles} onPress={() => onPress(text)}>
      <Text style={buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderRadius: Math.floor(buttonWidth),
    height: Math.floor(window.height / 6 - 40),
    margin: 5,
  },
  longButton: {
    flex: 0,
    width: Math.floor(window.width / 2 - 10),
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
  buttonOperator: {
    backgroundColor: '#f09a36',
  },
  buttonAdditional: {
    backgroundColor: '#a6a6a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
  },
})
