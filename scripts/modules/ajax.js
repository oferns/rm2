'use strict';



define(function () {

    var init = function () {
        var row = document.getElementsByClassName('row')[0];
        history.replaceState(row.outerHTML, '', document.location.href);
    }
    window.onpopstate = function (event) {
        var row = document.getElementsByClassName('row')[0];
        var oldrow = document.createRange().createContextualFragment(event.state);
        var parent = row.parentNode;
        parent.replaceChild(oldrow, row);
    };


    function fadeout(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    };

    function fadein(element) {
        var op = 0.1;  // initial opacity
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }
    var findParentRow = function (element) {
        var parent = element.parentNode;
        while (parent) {
            if (parent.classList && parent.classList.contains('row')) {
                return parent;
            };
            parent = parent.parentNode;
        }

        var parents = element.ownerDocument.getElementsByClassName('row');

        if (parents.length) {
            return parents[0];
        }

        parent = element.ownerDocument.createElement('DIV');
        parent.classList.add('row');
        var body = element.ownerDocument.getElementById('body');
        body = body || element.ownerDocument.body;

        while (body.firstChild) {
            body.removeChild(body.firstChild);
        };

        body.appendChild(parent);
        return parent;
    }

    var ajaxPage = function (anchor) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', anchor.href);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                var row = findParentRow(anchor);
                var parent = row.parentNode;
                var newrow = document.createRange().createContextualFragment(xhr.responseText);
                parent.replaceChild(newrow, row);
                history.pushState(xhr.responseText, '', anchor.href);
            } else {
                alert('failed! ' + xhr.status);
            };
        }
        xhr.send();
    }
    init();

    return function (element) {
        element.addEventListener('click', function (e) {
            switch (e.target.tagName) {
                case 'A':
                    e.preventDefault();
                    ajaxPage(e.target);
                    break;
                default: break;
            };
        });
    }
});