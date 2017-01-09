const npmInstall = require("./lib/npm-util").npmInstall;
const npmUninstall = require("./lib/npm-util").npmUninstall;
const npmList = require("./lib/npm-util").npmList;
module.exports = {
    install: function(packages, opts) {
        if (packages.length == 0 || !packages || !packages.length) {Promise.reject(new Error("No packages found"));}
        if (typeof packages == "string") {
            packages = [packages];
        }
        if (!opts) {
            opts = {};
        }
        return npmInstall(packages, opts);
    },

    uninstall: function(packages, opts) {
        if (packages.length == 0 || !packages || !packages.length) {Promise.reject(new Error(new Error("No packages found")));}
        if (typeof packages == "string") {
            packages = [packages];
        }
        if (!opts) {
            opts = {};
        }
        return npmUninstall(packages, opts);
    },

    list: function(opts) {
        return npmList(opts)
    }
};
