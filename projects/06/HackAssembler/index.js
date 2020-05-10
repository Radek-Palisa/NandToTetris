const path = process.argv[2]

if (!path) {
  throw new Error('Missing path argument')
}

const fs = require('fs')
const { compDict, destDict, jumpDict, symbolTableDict } = require('./consts')

function createSymbolTable({ initialTable, initialVariableStartAddress }) {
  const table = { ...initialTable }
  let n = initialVariableStartAddress
  return {
    getSymbol: (key) => {
      const value = table[key]
      if (value != null) return value
      table[key] = n
      n++
      return table[key]
    },
    setSymbol: (key, value) => (table[key] = value)
  }
}

function stripWhiteSpace(line) {
  return line.split('//')[0].trim()
}

function convertDecTo15BitBinary(number) {
  const binaryString = number.toString(2)
  const prefix = Array.from({ length: 15 - binaryString.length }).map(() => 0).join('')
  return `${prefix}${binaryString}`
}

function translateCinstructionIntoBinary(instruction) {
  const codes = instruction.split(';')
  const destAndComp = codes[0]

  const jump = (codes[1] || '').trim()
  const jumpCode = jumpDict[jump]

  const m = destAndComp.split('=')
  const dest = m.length === 1 ? '' : m[0]
  const destCode = destDict[dest]

  const comp = m.length === 1 ? m[0] : m[1]
  const compCode = compDict[comp]

  // return with 111 - C instruction
  return `111${compCode}${destCode}${jumpCode}`
}

function parse(fileContents, setSymbol) {
  const splittedByLines = fileContents.split('\r\n')

  const instructions = []

  for (const line of splittedByLines) {
    const instruction = stripWhiteSpace(line)

    if (instruction !== "") {
      if (instruction.startsWith('(')) {
        const tableKey = instruction.replace('(', '').replace(')', '')
        setSymbol(tableKey, instructions.length)
      } else {
        instructions.push(instruction)
      }
    }
  }

  return instructions
}

function translateInstructionsToBinary(instructions, getSymbol) {
  return instructions.map(instruction => {
    if (instruction.startsWith('@')) {
      const s = instruction.split('@')[1]
      const instructionAddress = isNaN(s) ? getSymbol(s) : parseInt(s)
      // return with opcode 0 - A instruction
      return `0${convertDecTo15BitBinary(instructionAddress)}` 
    }

    return translateCinstructionIntoBinary(instruction)
  })
}

function main(path) {
  const { getSymbol, setSymbol } = createSymbolTable({ 
    initialTable: symbolTableDict, 
    initialVariableStartAddress: 16
  })

  const fileContents = fs.readFileSync(path, 'utf8')

  const instructions = parse(fileContents, setSymbol)

  const binaryInstructions = translateInstructionsToBinary(instructions, getSymbol)

  const newFileContents = binaryInstructions.join('\r\n')

  fs.writeFileSync(path.replace('asm', 'hack'), newFileContents)

  console.log('done');
}

//
// run program
//
main(path)