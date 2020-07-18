import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { evaluate } from 'mathjs'
import numbro from 'numbro'
import { Button } from './src/components/Button'
import {
  ADDITION,
  ALL_CLEAR,
  DECIMAL,
  DIVISION,
  EQUAL,
  MEMORY_ADD,
  MEMORY_CLEAN,
  MEMORY_READ,
  MEMORY_SAVE,
  MEMORY_SUB,
  MULTIPLICATION,
  PERCENTAGE,
  PLUS_MINUS,
  SUBTRACTION,
} from './src/constants/calcButtons'

const operators = [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, EQUAL]
const maxSizeBeforeResizing = 9
const maxPrecision = 16

export default function App() {
  const [displayValue, setDisplayValue] = useState('0')
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [firstOperand, setFirstOperand] = useState(firstOperand)
  const [memorySave, setMemorySave] = useState(true)
  const [memory, setMemory] = useState(null)

  const processInput = (text) => {
    if (waitingForOperand) {
      setDisplayValue(`${text}`)
      setWaitingForOperand(false)
    } else {
      let newDisplayValue =
        displayValue === '0' ? `${text}` : `${displayValue}${text}`
      setDisplayValue(`${newDisplayValue}`)
      setWaitingForOperand(false)
    }
  }

  const processOperator = (text) => {
    let newDisplayValue = null
    let newOperator = null
    let stringToEvaluate = null

    if (firstOperand === '0' || operator == null || waitingForOperand) {
      setWaitingForOperand(true)
      setFirstOperand(displayValue)
      setOperator(text)
    } else {
      stringToEvaluate = `${firstOperand}${operator}${displayValue}`
      try {
        newDisplayValue = `${evaluate(stringToEvaluate)}`
      } catch (e) {
        newDisplayValue = 'Error'
      }
      if (newDisplayValue === 'Infinity') {
        newDisplayValue = 'Error'
      }
      newOperator = text === EQUAL ? null : text
      setDisplayValue(`${newDisplayValue}`)
      setWaitingForOperand(true)
      setFirstOperand(`${newDisplayValue}`)
      setOperator(newOperator)
    }
  }

  const validateOperator = (text) => {
    if (text === MULTIPLICATION) {
      return '*'
    } else if (text === DIVISION) {
      return '/'
    } else if (text === SUBTRACTION) {
      return '-'
    }
    return text
  }

  const processAllClear = () => {
    setDisplayValue('0')
    setFirstOperand('0')
    setOperator(null)
    setWaitingForOperand(false)
  }

  const processPlusMinus = () => {
    const newDisplayValue =
      parseFloat(displayValue).toPrecision(maxPrecision) * -1
    setDisplayValue(newDisplayValue)
    setWaitingForOperand(false)
  }

  const processPercentage = () => {
    const newDisplayValue =
      parseFloat(displayValue).toPrecision(maxPrecision) / 100
    setDisplayValue(newDisplayValue)
    setWaitingForOperand(false)
  }

  const processDecimal = (text) => {
    const isDecimal = `${displayValue}`.includes('.')
    let newDisplayValue = null

    if (waitingForOperand) {
      setDisplayValue('0')
      waitingForOperand(false)
    } else {
      if (!isDecimal) {
        newDisplayValue = `${displayValue}${text}`
        setDisplayValue(newDisplayValue)
        setWaitingForOperand(false)
      }
    }
  }

  const processMemorySave = () => {
    setMemory(parseFloat(displayValue))
    setMemorySave(false)
  }

  const processMemoryClean = () => {
    setMemory(null)
    setMemorySave(true)
  }

  const processMemoryAdd = () => {
    if (memory) {
      setMemory((memory) => {
        return memory + parseFloat(displayValue)
      })
    }
  }

  const processMemorySub = () => {
    if (memory) {
      setMemory((memory) => {
        return memory - parseFloat(displayValue)
      })
    }
  }

  const processMemoryRead = () => {
    if (memory) {
      setDisplayValue(memory)
      setWaitingForOperand(false)
    }
  }

  const pressHandler = (text) => {
    const isOperator = operators.includes(text)
    if (isOperator) {
      processOperator(validateOperator(text))
      return
    }
    switch (text) {
      case ALL_CLEAR:
        processAllClear()
        return
      case PLUS_MINUS:
        processPlusMinus()
        return
      case PERCENTAGE:
        processPercentage()
        return
      case DECIMAL:
        processDecimal(text)
        return
      case MEMORY_SAVE:
        processMemorySave()
        return
      case MEMORY_CLEAN:
        processMemoryClean()
        return
      case MEMORY_ADD:
        processMemoryAdd()
        return
      case MEMORY_SUB:
        processMemorySub()
        return
      case MEMORY_READ:
        processMemoryRead()
        return
    }
    processInput(text)
  }
  const valueFontSize =
    `${displayValue}`.length > maxSizeBeforeResizing ? 30 : 60
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View>{!memorySave && <Text style={styles.memory}>M</Text>}</View>

      <View style={styles.calculatorBody}>
        <Text style={{ ...styles.value, fontSize: valueFontSize }}>
          {numbro(parseFloat(displayValue)).format({
            thousandSeparated: true,
          })}
        </Text>

        <View style={styles.row}>
          <Button text={ALL_CLEAR} theme="additional" onPress={pressHandler} />
          <Button text={PLUS_MINUS} theme="additional" onPress={pressHandler} />
          <Button text={PERCENTAGE} theme="additional" onPress={pressHandler} />
          <Button text={DIVISION} theme="operator" onPress={pressHandler} />
        </View>

        <View style={styles.row}>
          <Button
            text={memorySave ? MEMORY_SAVE : MEMORY_CLEAN}
            onPress={pressHandler}
          />
          <Button text={MEMORY_READ} onPress={pressHandler} />
          <Button text={MEMORY_SUB} onPress={pressHandler} />
          <Button text={MEMORY_ADD} theme="operator" onPress={pressHandler} />
        </View>

        <View style={styles.row}>
          <Button text="7" onPress={pressHandler} />
          <Button text="8" onPress={pressHandler} />
          <Button text="9" onPress={pressHandler} />
          <Button
            text={MULTIPLICATION}
            theme="operator"
            onPress={pressHandler}
          />
        </View>

        <View style={styles.row}>
          <Button text="4" onPress={pressHandler} />
          <Button text="5" onPress={pressHandler} />
          <Button text="6" onPress={pressHandler} />
          <Button text={SUBTRACTION} theme="operator" onPress={pressHandler} />
        </View>

        <View style={styles.row}>
          <Button text="1" onPress={pressHandler} />
          <Button text="2" onPress={pressHandler} />
          <Button text="3" onPress={pressHandler} />
          <Button text={ADDITION} theme="operator" onPress={pressHandler} />
        </View>

        <View style={styles.row}>
          <Button size="long" text="0" onPress={pressHandler} />
          <Button text={DECIMAL} onPress={pressHandler} />
          <Button text={EQUAL} theme="operator" onPress={pressHandler} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  calculatorBody: {
    paddingBottom: 10,
  },
  value: {
    color: '#fff',
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 10,
  },
  memory: {
    color: '#fff',
    marginLeft: 20,
    marginTop: 20,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
  },
})