// ==UserScript==
// @name         No more google before you continue
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Universal solution to remove "Before you continue"
// @author       Davilarek
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // filter out body. In normal case there should be 3 DIV's. First is the search UI, second is "Before you continue dialog" and I don't know what is third.
    // this code filters out the search UI, so there is only the dialog and the thing I don't know what it is.
    var element = Array.from(document.body.children).filter(x => !x.attributes["data-hveid"] && x.tagName == "DIV")[0];
    
    // next filter out all buttons from dialog.
    var filter = Array.from(element.getElementsByTagName("button")).filter(x => !x.attributes.role && !x.attributes["aria-label"]);
    
    // no buttons found. Probably not in incognito mode or dialog is already closed.
    if (filter.length == 0)
        return;
    
    // simulate click of "Deny" button.
    filter[0].click();
})();
