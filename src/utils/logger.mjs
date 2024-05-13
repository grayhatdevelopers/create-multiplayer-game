import chalk from "chalk"

export const logger = {
  error(...args) {
    console.error(chalk.red(...args))
  },
  warn(...args) {
    console.warn(chalk.yellow(...args))
  },
  info(...args) {
    console.info(chalk.cyan(...args))
  },
  success(...args) {
    console.log(chalk.green(...args))
  },
  log(...args) {
    console.log(...args)
  },
  break() {
    console.log("")
  },
}