

(function(){

  var functionQueue = [];

  //Omni Function and Helpers

  window.$l =  function(selector){
    var arrayElementList = [];
    if (typeof(selector) === "function") {
      addDocumentReadyCallback(selector);

    } else if (selector instanceof HTMLElement){
      return transformHTMLElementToDOMCollection(selector);

    } else {
      return createDOMCollectionFromQuery(selector);
    }
  };

  document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
      triggerFunctionQueue();
    }
  };

  var triggerFunctionQueue = function(){
    for (var i = 0; i < functionQueue.length; i++) {
      //TODO do these functions return somehting?
      var functionToCall = functionQueue[i];
      functionToCall();
    }
  };

  var transformHTMLElementToDOMCollection = function(htmlElement) {
    return new DOMNodeCollection([htmlElement]);
  };

  var createDOMCollectionFromQuery = function(selector) {
    var elementList = document.querySelectorAll(selector);
    var arrayElementList = [].slice.apply(elementList);
    return new DOMNodeCollection(arrayElementList);
  };

  var addDocumentReadyCallback = function (callback){
    switch (document.readyState) {
      case "loading":
        functionQueue.push(callback);
        break;
      case "interactive":
        callback();
        break;
      case "complete":
        callback();
        break;
    }
  };

  // $l functions

  window.$l.extend = function(){
    if (arguments.length < 2){
      return arguments;
    } else {
      var argsArray = [].slice.apply(arguments);
      var objToMerge = argsArray[0];

      for (var i = 1; i < argsArray.length; i++) {
        for (var key in argsArray[i]) {
          if (argsArray[i].hasOwnProperty(key)) {
            objToMerge[key] = argsArray[i][key];
          }
        }
      }
      return objToMerge;
    }
  };

  var defaultOptions = {
    type : "GET",
    url : location,
    data : "json",
    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
    success: function() {
      console.log("This was a successful attempt!");
    },
    error: function() {
      console.log("An error occurred");
    }
  };

  window.$l.ajax = function(options){
    // debugger;
    var finalOptions = window.$l.extend({},
      defaultOptions, options);
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === XMLHttpRequest.DONE){
        if (httpRequest.status === 200){
          finalOptions.success(httpRequest.responseText);
        } else {
          finalOptions.error();
        }
      }
    };

    httpRequest.open(finalOptions["type"], finalOptions["url"], true);
    if (finalOptions["type"] === "POST"){
      httpRequest.setRequestHeader('Content Type',
        finalOptions["contentType"]);
      httpRequest.send(finalOptions["data"]);
    } else {
      httpRequest.send();
    }

  };

//   function loadXMLDoc() {
//     var xmlhttp;
//
//     if (window.XMLHttpRequest) {
//         xmlhttp = new XMLHttpRequest();
//     }
//
//     xmlhttp.onreadystatechange = function() {
//       if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
//         if(xmlhttp.status == 200){
//           document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
//         }  else {
//           alert('something else other than 200 was returned')
//         }
//       }
//     }
//
//     xmlhttp.open("GET", url, true);
//     xmlhttp.send();
// }

  //DOMNode Functions

  function DOMNodeCollection(htmlElements) {
    this.elements = htmlElements;
  }

  DOMNodeCollection.prototype.html = function (string) {

    if (string === undefined){
      return this.elements[0].innerHTML;
    } else {
      this.elements.forEach(function(el){
        el.innerHTML = string;
      });
    }

  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.append = function (object) {
    var that = this;

    this.elements.forEach(function(el){

      if (typeof(object) === "string") {

        var inHTML = el.innerHTML;
        inHTML += object;
        el.innerHTML = inHTML;

      } else if (object instanceof HTMLElement) {

        el.appendChild(object.cloneNode(true));

      } else if (object instanceof DOMNodeCollection) {
        for (var i = 0; i < object.elements.length; i++) {
          el.appendChild(object.elements[i].cloneNode(true));
        }
      }
    });

  };

  DOMNodeCollection.prototype.attr = function (attribute, value) {

    if (value === undefined){
      if (this.elements[0].hasAttribute(attribute)){
        return this.elements[0].getAttribute(attribute);
      } else {
        return undefined;
      }
    }

    this.elements.forEach(function(el){
      el.setAttribute(attribute, value);
    });

  };

  DOMNodeCollection.prototype.addClass = function (string) {

    for (var i = 0; i < this.elements.length; i++) {
      var prevClass = this.elements[i].className;
      var newClass = prevClass + " " + string;
      this.elements[i].className = newClass;
    }

  };

  DOMNodeCollection.prototype.removeClass = function (string) {
    for (var i = 0; i < this.elements.length; i++) {
      var prevClass = this.elements[i].className;
      var arrayClass = prevClass.split(" ");
      var index = arrayClass.indexOf(string);
      arrayClass.splice(index, 1);
      this.elements[i].className = arrayClass.join(" ");
    }
  };

  DOMNodeCollection.prototype.children = function () {
    var children = [];
    this.elements.forEach(function(el){
      children = children.concat([].slice.apply(el.children));
    });
    return new DOMNodeCollection(children);
  };

  DOMNodeCollection.prototype.parent = function () {
    var parents = [];
    this.elements.forEach(function(el){
      if (parents.indexOf(el.parentElement) === -1){
        parents = parents.concat(el.parentElement);
      }
    });
    return new DOMNodeCollection(parents);
  };

  DOMNodeCollection.prototype.find = function (selector) {
    var foundNodes = [];
    this.elements.forEach(function(el){
      var foundArray = [].slice.apply(el.querySelectorAll(selector));
      foundNodes = foundNodes.concat(foundArray);
    });
    return new DOMNodeCollection(foundNodes);
  };

  DOMNodeCollection.prototype.remove = function () {
    this.elements.forEach(function(el){
      el.remove();
    });
    this.elements = [];
  };

  DOMNodeCollection.prototype.on = function (type, callBack) {
    this.elements.forEach(function(el){
      el.addEventListener(type, callBack);
    });
  };
// TODO do the callbacks ahve to be the same funciton
  DOMNodeCollection.prototype.off = function (type, callBack) {
    this.elements.forEach(function(el){
      el.removeEventListener(type, callBack);
    });
  };



})();
