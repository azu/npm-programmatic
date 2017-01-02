var npm = require("../../index");

describe("Test listing of installed packages", ()=>{
	it("should list all installed packages by npm-programmatic", function(done){
		npm.list('.')
		.then(function(packages){
			for(var i in packages){
				if(packages[i].indexOf('npm')!=-1){
					return done();
				}
			}
			return done(new Error("npm not found!"));
		})
		.catch(function(err, stderr){
			return done(err, stderr);
		})
	});
});
