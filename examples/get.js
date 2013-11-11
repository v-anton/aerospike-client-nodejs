var aerospike = require('aerospike')
var assert = require('assert')
var msgpack = require('msgpack')
var sleep = require('sleep')
var status = aerospike.Status;
var policy = aerospike.Policy;
var config = {
	hosts:[{ addr:"127.0.0.1", port: 3000 }
	      ]}

var client = aerospike.connect(config)

var n = process.argv.length >= 3 ? parseInt(process.argv[2]) : 14000
var m = 0

console.time(n + " get");
for (var i = 1; i <= n; i++ ) {

  var k1 = {'ns':"test",'set':"demo",'key':"value"+i}; 

  var readpolicy = { timeout : 10, Key : policy.Key.KEY };
  //This function gets the complete record with all the bins.	
  client.get(k1,function (err, rec, meta){
	 if ( err.code != status.AEROSPIKE_OK ) {
        console.log("error %s",err.message);
    }
	console.log(rec['i']);
	console.log(rec['s']);
	//Unpack the Buffer using msgpack
	if ( rec['b'] instanceof Buffer) {
		var unbuf = msgpack.unpack(rec['b']);
		console.log(unbuf);
	}
    console.log(meta);
    if ( (++m) == n ) {
        console.timeEnd(n + " get");
	    client.close();
    }
	});
 
}

