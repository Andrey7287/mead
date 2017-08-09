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
  let basePath = 'http://localhost:3000';

  test('test acces for adding attraction', (done)=>{
    rest.post(basePath+'/api/attraction', {data:attraction}).on('success', (data)=>{
      assert(data.name === attraction.name);
      assert(data.description === attraction.description);
      done();
    })
  });
  test('test acces for getting attraction', (done)=>{
    rest.post(basePath+'/api/attraction', {data:attraction}).on('success', (data)=>{
      rest.get(basePath+'/api/attraction/'+data.id).on('complete', (obj)=>{
        assert(data.name === attraction.name);
        assert(data.description === attraction.description);
        done();
      });
    });
  });
});