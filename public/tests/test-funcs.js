suite('Test for my funcs', function(){

suite('isPrime(int)', function(){
  test('isPrime test for prime num', function(){
    assert(isPrime(2) && isPrime(5) && isPrime(13) && isPrime(17));
  });
  test('isPrime test for nonPrime num', function(){
     assert(!isPrime(0) && !isPrime(1) && !isPrime(14) && !isPrime(100)); //00000000000
  });
});
suite('factorial(int)', function(){
  test('return factorial', function(){
    assert(factorial(0) === 1 && factorial(1) === 1 && factorial(6) === 720 && factorial(11) === 39916800);
  });
});
suite('fibonachi(int)', function(){
  test('return fibonachi', function(){
    assert(fibonachi(0) === 0 && fibonachi(3) === 2 && fibonachi(7) === 13);
  });
});
suite('mFibonachi(int)', function(){
  test('fibonachi throgh memoization', function(){
    assert(mFibonachi(0) === 0 && mFibonachi(3) === 2 && mFibonachi(7) === 13 && mFibonachi(77) === 5527939700884757);
  });
});

});