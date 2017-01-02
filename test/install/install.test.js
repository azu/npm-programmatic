var npm = require("../../index");
var fs = require("fs");
var should = require("should");
var exec = require('child_process').exec,child;

describe("Test installation of packages", ()=>{
	beforeEach(()=>{
		child = exec('rm -rf ./node_modules/bluebird',function(err,out) {});
		child = exec('cp ./package.json ./test/backup/package.json',function(err,out) {});
	});
	afterEach(()=>{
		child = exec('rm -rf ./node_modules/bluebird',function(err,out) {});
		child = exec('cp ./test/backup/package.json ./package.json' ,function(err,out) {});
	});
	it("should install package", function(done){
		this.timeout(5000);
		npm.install(["bluebird"], {cwd:'.'}).then((result)=>{
			try{
				var checkExists = fs.accessSync('./node_modules/bluebird');
			} catch(err){
				return done(err);
			}
			return done();
		}).catch((err)=>{
			return done(err)
		});
	});

	it("should install package inside a node project and save it to package.json", function(done){
		this.timeout(5000);
		npm.install(["bluebird"], {cwd:'.', save:true}).then((result)=>{
			try{
				var checkExists = fs.accessSync('./node_modules/bluebird');
				var contents = require('../../package.json');
				if(!contents.dependencies['bluebird']){
					throw new Error();
				}
			} catch(err){
				return done(err);
			}

			return done();
			
		}).catch((err)=>{
			return done(err);
		});
	});
});