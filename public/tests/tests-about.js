suite('Tests for /about', ()=>{
  test('Has link to contacts', ()=>{
    assert(document.querySelector('[href$=contacts]'));
  });
});