const assert = require('chai').assert,
      http = require('http'),
      rest = require('restler');

suite('API tests', function(){
  let attraction = {
    lat: 45.516011,
    lng: -122.682062,
    name: 'Museum',
    description: 'This is a test ...',
    email: 'test@gmail.com'  
  };
  let base = 'http://localhost:3000';
  test('test acces for adding attraction', function(done){
    rest.post(base+'/api/attraction', {data:attraction}).on('succes', function(data){
      assert(data.name === attraction.name);
      assert(data.description === attraction.description);
      done();
    })
  });
});