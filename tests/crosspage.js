const Browser = require('zombie'),
      assert = require('chai').assert;
var browser;

suite('Crosspage', () => {

  setup(() => {
    browser = new Browser();
  });

  test('Rates request for group tour at Kwai river', (done) => {

    var referrer = 'http://localhost:3000/tours/kwai';

    browser.visit(referrer, ()=>{
      browser.clickLink('.request-rate', ()=>{
        browser.assert.input('#idReferrer', 'referrer');  
        done();
      });
    });
  });

  test('Rates request for group tour at Oregon', (done)=>{
    var referrer = 'http://localhost:3000/tours/oregon';
    browser.visit(referrer, ()=>{
      browser.clickLink('.request-rate', ()=>{
        assert(browser.field('referrer').value === referrer);
        done();
      });
    });
  });

  test('If direct opening, referrer have to be empty', (done)=>{
      browser.visit('http://localhost:3000/tours/request-group-rate', ()=>{
          assert( !browser.field('referrer').value );
          done();
        });
    });

});