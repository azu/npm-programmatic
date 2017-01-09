var npm = require("../../index");
var fs = require("fs");
var path = require("path");
var should = require("should");
const fixtureDir = path.join(__dirname, "fixtures");
const packageFilePath = path.join(__dirname, "package.json");
const bluebirdDir = path.join(__dirname, "fixtures", "node_modules", "bluebird");
describe("Test uninstallation of packages", () => {
    beforeEach(() => {
        return npm.install(["bluebird"], {cwd: fixtureDir, save: true});
    });
    it("should uninstall package", function(done) {
        this.timeout(10000);
        npm.uninstall(['bluebird'], {cwd: fixtureDir})
        .then(function(status) {
            try {
                var checkExists = fs.accessSync(bluebirdDir);
            } catch (err) {
                return done();
            }
            return done(new Error("Uninstallation failed, package still exists in node_modules."));
        })
        .catch(function(err) {
            done(err);
        });
    });

    it("should uninstall package inside a node project and save it to package.json", function(done) {
        this.timeout(5000);
        npm.uninstall(['bluebird'], {cwd: fixtureDir, save: true}).then(() => {
            try {
                var contents = fs.readFileSync(packageFilePath, 'UTF-8');
                contents = JSON.parse(contents);
                var checkExists = fs.accessSync(bluebirdDir);
                if (!contents.dependencies['bluebird']) {
                    return done(new Error("exit dependencies"));
                }
            } catch (err) {
                return done();
            }
        }).catch((err) => {
            return done(err);
        });
    });

});