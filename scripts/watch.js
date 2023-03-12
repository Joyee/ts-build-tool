import { exec } from 'child_process'
import ora from 'ora'
import chokidar from 'chokidar'
import chalk from 'chalk'

const spinner = ora('Compiling Typescript files...').start()

// 编译 Typescript文件
function compileTsFile(filePath) {
  console.log(chalk.blue(`Compiling ${filePath}`))
  exec(`tsc ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Error compiling ${filePath}: ${err}`))
    } else {
      console.log(chalk.green(`Finished compiling ${filePath}`))
    }
  })
}

// 监听文件变化
function watchTsFiles(filePath) {
  const watcher = chokidar.watch(filePath, {
    ignored: /(^|[/\\])\../, // 忽略隐藏文件
    persistent: true, // 持续监听文件变化
  })

  watcher
    .on('add', (path) => compileTsFile(path))
    .on('change', (path) => compileTsFile(path))
    .on('unlink', (path) => console.log(chalk.yellow(`File ${path} has been removed`)))
}

// 获取要监听的文件路径
const filePath = process.argv[2] // 获取启动脚本时传入的第一个参数
console.log(filePath)
if (!filePath) {
  console.log(chalk.red('Please specify a file or directory to watch.'))
  console.log(chalk.yellow('Usage: npm run watch -- path/to/file.ts'))
  process.exit(0)
}

// 监听
watchTsFiles(filePath)

spinner.succeed(chalk.green('Compilation complete!'))
