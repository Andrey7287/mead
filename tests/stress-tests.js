const loadtest = require('loadtest'),
      expect = require('chai').expect;

suite('Stress tests', function(){

  test('Home page should execute 50 request per second', done =>{
    let options = {
      url: 'http://localhost:3000/',
      concurrency: 4,
      maxRequests: 50
    };
    loadtest.loadTest(options, function(err, result){
      expect(!err);
      expect(result.totalTimeSeconds < 1);
      done();
    });
  });

});