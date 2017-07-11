const isPrime  = int => {
  
  if ( isNaN(int) || int <= 1 || int !== Math.floor(int) ) return false;
  
  var n = int,
      div = n - 1;

  while ( div > 1 ) {
    if ( n % div === 0 ) return false;
    div--;

  }
  return true;

};

const factorial = int => {
  return int <= 1 ? 1 : int*factorial(int-1);  
}
/**
 * 
 * @param {Number} int 
 * return fibonachi num
 */
const fibonachi = int => int <= 1 ? int : fibonachi(int-1) + fibonachi(int-2); 

// const MemoizedFib = function(){
//   let cash = {};
//   let fib = function(int){
//      if ( int <= 1 ) {
//        return int
//      } else {
//        var sum1, sum2;
//        if ( int - 1 in cash ) {
//         sum1 = cash[int - 1];
//         console.log('from cash'); 
//        } else {
//         sum1 = fib(int-1);
//         cash[int - 1] = sum1;
//        };
//        if ( int - 2 in cash ) {
//         sum2 = cash[int - 2];
//         console.log('from cash'); 
//        } else {
//         sum2 = fib(int-2);
//         cash[int - 2] = sum2;
//        };
//        return sum1 + sum2;
//      }
//   };
//   return fib;
// };
//mFibonachi = MemoizedFib();


let memoize = fn => {
  let cache = new Map
  return int => {
    if (!cache.has(int)) {
      cache.set(int, fn(int))
    }
    return cache.get(int)
  }
}
let mFibonachi = memoize(int => int <= 1 ? int : mFibonachi(int-1) + mFibonachi(int-2));