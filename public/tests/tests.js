mocha.ui('tdd');
var assert = chai.assert;

suite('Global tests', ()=>{
  test('HTML title test', ()=>{
    var title = document.title.toLowerCase();
    assert( title && title.match(/\S/) && title !== 'todo' );
  });
});


mocha.run();