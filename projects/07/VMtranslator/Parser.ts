const decoder = new TextDecoder("utf-8");

function getCommandType(command: string) {
  switch (command) {
    case "add":
    case "sub":
      return "C_ARITHMETIC";
    case "push":
      return "C_PUSH";
    case "pop":
      return "C_POP";
    default:
      throw new Error("invalid command type");
  }
}

export default class Parser {
  private instructions: string[][];
  private current: number;

  constructor(path: string) {
    // read file
    const rawData = Deno.readFileSync(path);
    const data = decoder.decode(rawData);
    this.instructions = this.parseFile(data);
    this.current = 0;
    // console.log(this.instructions);
  }

  private parseFile(fileContents: string) {
    const lines = fileContents.split("\r\n");

    const instructions = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed !== "" && !trimmed.startsWith("//")) {
        const commands = trimmed.split(/\s+/); // split on whitespace
        instructions.push(commands);
      }
    }
    return instructions;
  }

  hasMoreCommands(): boolean {
    return this.current < this.instructions.length;
  }

  advance() {
    this.current++;
  }

  commandType() {
    const command = this.instructions[this.current][0];
    return getCommandType(command);
  }

  arg1() {
    const commandType = this.commandType();
    const currentInstruction = this.instructions[this.current];
    return commandType === "C_ARITHMETIC"
      ? currentInstruction[0]
      : currentInstruction[1];
  }

  arg2() {
    const currentInstruction = this.instructions[this.current];
    return parseInt(currentInstruction[2]);
  }
}
