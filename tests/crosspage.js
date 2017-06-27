const browser = require('chrome-launcher'),
      assert = require('chai').assert;

suite('Crosspage', ()=>{

  test('Rates request for group tour at Kwai river', (done)=>{
    
    var referrer = 'http://localhost:3000/tours/hood-river';
    
    browser.launch(referrer, ()=>{
      browser.launch
    });

  });

});
