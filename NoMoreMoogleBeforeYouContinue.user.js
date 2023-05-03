// ==UserScript==
// @name         No more google before you continue
// @version      1.0
// @description  Universal solution to remove "Before you continue"
// @author       Davilarek
// @match        http*://www.google.com
// @match        http*://consent.google.com/m?continue=*
// @match        http*://m.youtube.com
// @match        http*://m.youtube.com/*
// @match        http*://www.youtube.com/*
// @match        http*://www.youtube.com
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
        case "https://consent.google.com": {
            let elements = Array.from(document.getElementsByTagName("form")).filter(x=>!checkStyleOrClass(x.parentElement, "display", "none"));
            elements[0].getElementsByTagName("button")[0].click();
            break;
        }
        case "https://www.google.com":
        case "https://google.com": {
            // filter out body. In normal case there should be 3 DIV's. First is the search UI, second is "Before you continue dialog" and I don't know what is third.
            // this code filters out the search UI, so there is only the dialog and the thing I don't know what it is.
            let element = Array.from(document.body.children).filter(x => !x.attributes["data-hveid"] && x.tagName == "DIV")[0];

            // next filter out all buttons from dialog.
            let filter = Array.from(element.getElementsByTagName("button")).filter(x => !x.attributes.role && !x.attributes["aria-label"]);

            // no buttons found. Probably not in incognito mode or dialog is already closed. Or using android
            if (filter.length == 0 || Array.from(document.body.children).filter(x => x.attributes["aria-modal"] && !x.attributes["data-hveid"] && x.tagName == "DIV")[0])
            {
                //setTimeout(() => {
                element = Array.from(document.body.children).filter(x => x.attributes["aria-modal"] && !x.attributes["data-hveid"] && x.tagName == "DIV")[0];
                filter = Array.from(element.getElementsByTagName("button")).filter(x => !x.attributes.role && !x.attributes["aria-label"]);
                if (filter.length == 0)
                    return;
                filter[1].click();
                return;
                //}, 500);
            }
            // simulate click of "Deny" button.
            filter[0].click();
            break;
        }
        case "https://m.youtube.com": {
            setTimeout(() => {
                let elements = document.getElementsByClassName("eom-reject");
                if (elements.length > 0)
                    elements[0].getElementsByTagName("button")[0].onclick()
            }, 2000);
            break;
        }
        case "https://www.youtube.com": {
            const setup = () => {
                setTimeout(() => {
                    let filtered = Array.from(document.getElementsByTagName("ytd-button-renderer")).filter(x => x?.parentElement?.parentElement?.parentElement?.className.includes("consent") && x?.parentElement?.parentElement?.parentElement?.className.includes("body"));
                    if (filtered.length > 0) {
                        let correctIndx = 0;
                        //debugger;
                        filtered[correctIndx].getElementsByTagName("button")[0].click();
                    }
                }, 2900);
            };
            if(document.readyState === 'ready' || document.readyState === 'complete') {
                setup();
            } else {
                document.onreadystatechange = function () {
                    if (document.readyState == "complete") {
                        setup();
                    }
                }
            }
            break;
        }
        default:
            break;
    }
})();
