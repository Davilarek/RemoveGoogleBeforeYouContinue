// ==UserScript==
// @name         No more google before you continue
// @version      0.5
// @description  Universal solution to remove "Before you continue"
// @author       Davilarek
// @match        https://www.google.com
// @match        https://consent.google.com/m?continue=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    function checkStyleOrClass(element, styleName, styleValue) {
        if (element.style[styleName] === styleValue) {
            return true;
        }

        var computedStyle = getComputedStyle(element);
        for (var i = 0; i < element.classList.length; i++) {
            var className = element.classList[i];
            if (computedStyle[styleName] === styleValue) {
                return true;
            }
        }
        return false;
    }

    'use strict';
    switch (new URL(location.href).origin)
    {
        case "https://consent.google.com":
            var elements = Array.from(document.getElementsByTagName("form")).filter(x=>!checkStyleOrClass(x.parentElement, "display", "none"));
            elements[0].getElementsByTagName("button")[0].click();
            break;
        case "https://www.google.com":
        case "https://google.com":
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
            break;
        default:
            break;
    }
})();
