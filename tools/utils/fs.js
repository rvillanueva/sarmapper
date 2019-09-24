const ncp = require('ncp').ncp;
const fs = require('fs');
const glob = require('glob');
const rimrafWithCb = require('rimraf');

function fetch(filepath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, options || {}, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    })
  })
}

function mkdir(filepath) {
  return new Promise(resolve => {
    fs.mkdir(filepath, () => resolve());
  })
}

function copy(src, dest, options) {
  return new Promise((resolve, reject) => {
    ncp(src, dest, options, err => {
      if(err) return reject();
      resolve();
    })
  })
}

function write(filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, err => {
      if(err) return reject(err);
      resolve();
    })
  })
}

function readDirWalk(globPattern) {
  return new Promise((resolve, reject) => {
    glob(globPattern, {
      mark: true
    }, (err, files) => {
      if(err) return reject(err);
      const filesOnly = files.filter(file => isFile(file));
      resolve(filesOnly);
    });

    function isFile(filepath){
      return filepath.slice(filepath.length - 1) !== '/';
    }
  })
}

function getFiles(filepaths) {
  const promises = filepaths.map(async filepath => {
    const data = await fetch(filepath);
    return {
      filepath: filepath,
      data: data
    }
  })
  return Promise.all(promises);
}

function rimraf(filepath) {
  return new Promise((resolve, reject) => {
    const allowedPaths = ['/dist'];
    let isAllowed = false;
    allowedPaths.forEach(allowedPath => {
      if(filepath.indexOf(allowedPath) > -1) {
        isAllowed = true;
      }
    });
    if(!isAllowed) {
      return reject(new Error(`Filepath ${filepath} is not allowed.`));
    }
    rimrafWithCb(filepath, {}, () => {
      resolve();
    });
  })
}

module.exports = {
  fetch: fetch,
  mkdir: mkdir,
  copy: copy,
  write: write,
  readDirWalk: readDirWalk,
  getFiles: getFiles,
  rimraf: rimraf
}
