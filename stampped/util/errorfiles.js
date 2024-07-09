const { readdirSync, lstatSync } = require("fs");

const orderReccentFiles = (dir) =>
   readdirSync(dir)
      .filter(f => !f.startsWith('.') && lstatSync(`${dir}${f}`).isFile())
      .map(file => ({ file, mtime: lstatSync(`${dir}${file}`).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const getLatestErrorFile = () => {
   const files = orderReccentFiles(process.env.SERVER_ERROR_LOG_FOLDER);
   return files.length ? files[0] : undefined;
}

const getLatestErrorFileWithPath = () => {
   return `${process.env.SERVER_ERROR_LOG_FOLDER}${getLatestErrorFile()?.file}`
}

const getCurrentSystemTime = () => {
   let d = new Date()
   d.setMinutes(d.getMinutes() + new Date().getTimezoneOffset())
   return d.toLocaleTimeString("en-US", { hour12: false })
}

module.exports = {
   getLatestErrorFileWithPath,
   getCurrentSystemTime
}