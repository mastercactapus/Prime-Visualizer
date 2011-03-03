var primes=[2];

var primeStart=0; //index of prime to start at
var primeCount=27; //number of primes in model (Y axis)
var numStart=2; //number to start at
var numCount=100; //number of integers to display (X axis)

/* model element types: (current prime = y axis)
 * 0=Non-eliminated by current prime, and not prime
 * 1=Eliminated (uniquely) by current prime 
 * 2=Eliminated by current prime, but already eliminated by smaller prime
 * 3=Prime, but not equal to current prime
 * 4=Prime, equal to current prime
 */

var model=new Array(numCount); // the holy data array of arrayness
for (var i=0;i<numCount;i++) 
  model[i]=new Array(primeCount);
reCalc();

function reCalc(){
  for (var i=0;i<numCount;i++) 
   for (var j=0;j<primeCount;j++)
    doCalc(i,j);
}


function setModel(nStart, pStart, numbers, primes) { //sets the model dimentions directly via arguments
  resizeModel(numbers-numCount,primes-primeCount); //call resize first, so when move is called we can re-use data
  moveModel(nStart-numStart,pStart-primeStart);
}

function doCalc(num,prm) { // calculate type for number (index) and prime (index) and save it in the model matrix

  var number=num+numStart;
  var primen=prm+primeStart;
  var prime=getPrime(primen);
  if (number == prime) {model[num][prm]=4;return;}
  if (isPrime(number)) {model[num][prm]=3;return;}
  if (number % prime == 0) {
  for (var i=0;i<primen;i++)
   if (number % primes[i] == 0) {model[num][prm]=2;return;}
   model[num][prm]=1;
  }
  else 
   model[num][prm]=0; 
  
}

function moveModel(nStartAdd, pStartAdd) { //translates current model start locations
 if (primeStart + pStartAdd < 0) pStartAdd = 1 - primeStart;
 if (numStart + nStartAdd < 2) nStartAdd = 1 - numStart;
  if (Math.abs(nStartAdd)>=numCount | Math.abs(pStartAdd)>=primeCount){ //if we move too far in either way, it all needs to be recalculated
      numStart+=nStartAdd;
      primeStart+=pStartAdd;
      for (var i=0;i<numCount;i++)
	for (var j=0;j<primeCount;j++)
	  doCalc(i,j);
  } else {
    numStart+=nStartAdd/1;
    primeStart+=pStartAdd/1;
    for (var i=Math.abs(nStartAdd);i<numCount;i++){
      var src,dst;
      if (nStartAdd>0) {src=i;dst=i-nStartAdd;}
      else {src=i+nStartAdd;dst=i;}
      $.extend(model[dst],model[src]);
       //model[dst]=model[src];
       for (j=Math.abs(pStartAdd);j<primeCount;j++){
	 var psrc,pdst;
	       if (pStartAdd>0) {psrc=j;pdst=j-pStartAdd;}
	      else {psrc=j+pStartAdd;pdst=j;}
	      model[dst][pdst]=model[dst][psrc];
	      doCalc(dst,psrc);
       }
       for (var j=0;j<primeCount;j++)
	 doCalc(src,j);
    }
      
  }
}

function resizeModel(nAdd, pAdd) { //translates current model resolution, only calculating new values when needed.
 if (numCount+nAdd <=0) nAdd = 1 - numCount; //minimum length is 1 
 if (primeCount+pAdd <=0) pAdd = 1 - primeCount; //minimum length is 1
 model.length+=nAdd; //resize
 for (var i=0;i<model.length;i++) {
   if (i>numCount-1) { // if current index is greater than previous (i.e. this is a new line) then 
     model[i]=new Array(primeCount+pAdd); //Initialize new array for our primes
     for (var j=0;j<primeCount+pAdd;j++) doCalc(i,j); //calculate each ones type
   }else model[i].length+=pAdd; // if not new then resize existing array 
   if(pAdd>0)  //if we are expanding then calculate the new values
      for (j=primeCount;j<primeCount+pAdd;j++)
	doCalc(i,j);
 }
 primeCount+=pAdd; 
 numCount+=nAdd;
}

function getPrime(number){ //wrapper to ensure requested prime exists, generates if not
 generatePrimes((number-primes.length)/1+1);
 return primes[number];
}

function generatePrimes(number){ //generate set number of primes, and append them to primes array
    for (var i=0;i<number;i++) 
      primes[primes.length] = findNextPrime( primes[primes.length-1]/1 + 1 );}
    
function findHigherPrime(number) { //generate primes until largest prime is higher than 'number'
    while (primes[primes.length-1]<number)
      generatePrimes(1);}

function findNextPrime(start){ // find the next prime number given an integer 'start'
var cur=start;
if (cur % 2 == 0) cur+=1;
  while (!isPrime(cur)) cur+=2;
  return cur;
}

function isPrime(number){ // the all-knowing prime check function
    if (number == 1) return false;
    if (number == 2) return true;
    if (number % 2 == 0) return false;
    var l=Math.floor(Math.sqrt(number));
    for (var i=3; i<=l; i+=2)
     if (number % i == 0) return false;
    return true;
}