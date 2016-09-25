'use strict';



define(function () {

    var ajaxPage = function (anchor) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', anchor.href);
        xhr.onload = function () {
            if(xhr.status >= 200 && xhr.status < 400){
                alert('success');
            } else{
                alert('failed! ' + xhr.status);

            }
        }
        xhr.send();
    }

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