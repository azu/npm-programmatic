const exec = require('child_process').exec;
const npmBin = require.resolve(".bin/npm");
module.exports = {
  install: function(packages, opts) {
    if (packages.length == 0 || !packages || !packages.length) {Promise.reject(new Error("No packages found"));}
    if (typeof packages == "string") {
      packages = [packages];
    }
    if (!opts) {
      opts = {};
    }
    const optionArg = (opts.global ? " -g" : "")
                                              + (opts.save ? " --save" : "")
                                              + (opts.saveDev ? " --saveDev" : "")
                                              + (opts.ignoreScripts ? " --ignore-scripts" : "");
    const cmdString = `${npmBin} install ${packages.join(" ")} ${optionArg}`;

    return new Promise(function(resolve, reject) {
      const cmd = exec(cmdString, {cwd: opts.cwd ? opts.cwd : "/"}, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });

      if (opts.output) {
        const consoleOutput = function(msg) {
          console.log('npm: ' + msg);
        };

        cmd.stdout.on('data', consoleOutput);
        cmd.stderr.on('data', consoleOutput);
      }
    });
  },

  uninstall: function(packages, opts) {
    if (packages.length == 0 || !packages || !packages.length) {Promise.reject(new Error(new Error("No packages found")));}
    if (typeof packages == "string") {
      packages = [packages];
    }
    if (!opts) {
      opts = {};
    }
    const optionARg = (opts.global ? " -g" : "")
                                              + (opts.save ? " --save" : "")
                                              + (opts.saveDev ? " --saveDev" : "");
    const cmdString = `${npmBin} uninstall ${packages.join(" ")} ${optionARg}`;

    return new Promise(function(resolve, reject) {
      const cmd = exec(cmdString, {cwd: opts.cwd ? opts.cwd : "/"}, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });

      if (opts.output) {
        const consoleOutput = function(msg) {
          console.log('npm: ' + msg);
        };

        cmd.stdout.on('data', consoleOutput);
        cmd.stderr.on('data', consoleOutput);
      }
    });
  },

  list: function(path) {
    let global = false;
    if (!path) {
      global = true;
    }
    const optionArg = (global ? "-g " : " ");
    const cmdString = `${npmBin} ls --depth=0 ${optionArg}`;
    return new Promise(function(resolve, reject) {
      exec(cmdString, {cwd: path ? path : "/"}, (error, stdout, stderr) => {
        if (stderr == "") {
          if (stderr.indexOf("missing") == -1 && stderr.indexOf("required") == -1) {
            return reject(error);
          }
        }
        let packages = [];
        packages = stdout.split('\n');
        packages = packages.filter(function(item) {
          if (item.match(/^├──.+/g) != null) {
            return true
          }
          if (item.match(/^└──.+/g) != null) {
            return true
          }
          return undefined;
        });
        packages = packages.map(function(item) {
          if (item.match(/^├──.+/g) != null) {
            return item.replace(/^├──\s/g, "");
          }
          if (item.match(/^└──.+/g) != null) {
            return item.replace(/^└──\s/g, "");
          }
        });
        resolve(packages);

      });
    });
  }
};
