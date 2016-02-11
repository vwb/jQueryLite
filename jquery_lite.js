(function(){

  window.$l =  function(selector){
    var elementList = document.querySelectorAll(selector);
    var arrayElementList = [].slice.apply(elementList);
    return new DOMNodeCollection(arrayElementList);
  };

  function DOMNodeCollection(htmlElements) {
    this.elements = htmlElements;
  }

  
})();
