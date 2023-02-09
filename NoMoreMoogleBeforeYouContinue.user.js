// ==UserScript==
// @name         No more google before you continue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Universal solution to remove "Before you continue"
// @author       Davilarek
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var element = Array.from(document.body.children).filter(x => !x.attributes["data-hveid"] && x.tagName == "DIV")[0];
    var filter = Array.from(element.getElementsByTagName("button")).filter(x => !x.attributes.role && !x.attributes["aria-label"])
    if (filter.length == 0)
        return;
    filter[0].click();
})();