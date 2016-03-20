// remove var assignment and API for self-contained anon modules
var namedModule = (function(){
  document.addEventListener("DOMContentLoaded", initialise);

  function initialise (){
    console.log('a module template has been initialised');
  }

  function sayHello (){
    console.log('hello');
  }


  //API
  var API = {
    hello: sayHello
  };
  return API;
}());
