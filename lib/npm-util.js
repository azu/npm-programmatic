// MIT © 2017 azu
"use strict";
const npm = require("npm");
/**
 * @type {{saveDev: boolean, save: boolean, global: boolean, cwd: (*)}}
 */
const defaults = {
    saveDev: false,
    save: false,
    global: false,
    cwd: process.cwd()
};
/**
 * load `npm` config
 * @returns {Promise} the promise was filled when have finished load npm config.
 */
function loadNpm() {
    return new Promise((resolve, reject) => {
        npm.load(function(err, npm) {
            if (err) {
                reject(err);
            } else {
                resolve(npm);
            }
        });
    });
}

/**
 *
 * @param {Object}options
 * @returns {Promise}
 */
function loadNpmWithOptions(options = defaults) {
    return loadNpm().then(() => {
        if (options.save) {
            npm.config.set('save', true);
        }
        if (options.saveDev) {
            npm.config.set('save-dev', true);
        }
        if (options.global) {
            npm.config.set('global', true);
        }
        if (options.cwd) {
            npm.prefix = options.cwd;
        }
    })
}
/**
 * execute npm <command>
 * the command is like "publish".
 * @param {string[]} packages
 * @param {Object} options
 * @return {Promise}
 */
function npmInstall(packages = [], options = {}) {
    const npmOptions = {
        save: options.save !== undefined ? options.save : defaults.save,
        saveDev: options.saveDev !== undefined ? options.saveDev : defaults.saveDev,
        global: options.saveDev !== undefined ? options.global : defaults.global,
        cwd: options.cwd !== undefined ? options.cwd : defaults.cwd,
    };
    // change dir
    return loadNpmWithOptions(npmOptions).then(function() {
        return new Promise((resolve, reject) => {
            npm.commands["install"](packages, function(error, data) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
            if (options.output) {
                npm.registry.log.on("log", function(message) {
                    console.log(message);
                });
            }
        });
    });
}
function npmUninstall(packages = [], options = {}) {
    const npmOptions = {
        save: options.save !== undefined ? options.save : defaults.save,
        saveDev: options.saveDev !== undefined ? options.saveDev : defaults.saveDev,
        global: options.saveDev !== undefined ? options.global : defaults.global,
        cwd: options.cwd !== undefined ? options.cwd : defaults.cwd,
    };
    return loadNpmWithOptions(npmOptions).then(function() {
        if (npmOptions.cwd) {
            npm.prefix = npmOptions.cwd;
        }
        return new Promise((resolve, reject) => {
            npm.commands["uninstall"](packages, function(error, data) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
            if (options.output) {
                npm.registry.log.on("log", function(message) {
                    console.log(message);
                });
            }
        });
    });
}

function npmList(options) {
    const npmOptions = {
        cwd: options.cwd !== undefined ? options.cwd : defaults.cwd,
    };
    return loadNpmWithOptions(npmOptions).then(function() {
        if (npmOptions.cwd) {
            npm.prefix = npmOptions.cwd;
        }
        return new Promise((resolve, reject) => {
            // always shallow
            npm.config.set('depth', 0);
            npm.commands["list"](function(error, npm) {
                if (error) {
                    return reject(error);
                }
                const packageNames = Object.keys(npm.dependencies);
                resolve(packageNames);
            });
            if (options.output) {
                npm.registry.log.on("log", function(message) {
                    console.log(message);
                });
            }
        });
    });
}
module.exports = {
    loadNpm,
    npmInstall,
    npmUninstall,
    npmList
};