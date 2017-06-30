const fortune = require('../lib/fortune');
      expect = require('chai').expect;

suite('fortunes tests', function(){

  test('getFirtune() must return fortune', function(){
    expect(typeof fortune.getFortune() === 'string');
  });

});