export default class CodeWriter {
  path: string;
  instructions: Array<{ title: string; code: string[] }>;

  constructor(path: string) {
    this.path = path;
    this.instructions = [];
  }

  writeArithmetic(command: string) {
    this.instructions.push({ title: command, code: [] });
  }

  writePushPop(commandType: any, segment: string, index: number) {
    this.instructions.push({
      title: `${commandType} ${segment} ${index}`,
      code: [],
    });
  }

  close() {
    console.log(this.instructions);
  }
}
