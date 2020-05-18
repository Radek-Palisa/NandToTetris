import Parser from './Parser.ts'
import CodeWriter from './CodeWriter.ts'

const path = Deno.args[0]

if (!path) {
  throw new Error('missing path argument')
}

function main(path: string) {
  const parser = new Parser(path)
  const codeWriter = new CodeWriter(path)

  while (parser.hasMoreCommands()) {
    const commandType = parser.commandType()

    switch (commandType) {
      case 'C_ARITHMETIC':
        codeWriter.writeArithmetic(parser.arg1())
        break
      case 'C_POP':
      case 'C_PUSH':
        codeWriter.writePushPop(
          commandType, 
          parser.arg1(), 
          parser.arg2()
        )
    }

    parser.advance()
  }

  codeWriter.close()
}

main(path)
//  StackArithmetic/SimpleAdd/SimpleAdd.vm
// MemoryAccess/BasicTest/BasicTest.vm