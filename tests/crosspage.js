const Browser = require('zombie');
var browser;

suite('Crosspage', () => {

  setup(() => {
    browser = new Browser();
  });

  test('Rates request for group tour at Kwai river', (done) => {

    var referrer = 'http://localhost:3000/tours/kwai';

    browser.visit(referrer, ()=>{
      browser.clickLink('.request-rate', ()=>{
        setTimeout(function() {
          browser.assert.input('#idReferrer', 'referrer');  
          
        }, 1000);
        done();
      });
    });
  });

  // test('Rates request for group tour at Oregon', (done)=>{
  //   var referrer = 'http://localhost:3000/tours/oregon';
  //   browser.visit(referrer, ()=>{
  //     browser.clickLink('.request-rate', ()=>{
  //       assert(browser.field('referrer').value === referrer);
  //       done();
  //     });
  //   });
  // });

  test('If direct opening, referrer have to be empty', (done)=>{
      browser.visit('http://localhost:3000/tours/tours-rate', ()=>{
          browser.assert.input('#idReferrer', '');
          done();
        });
    });

});