'use strict';

(function modalHandlers() {
  var modalForm = document.querySelector('.modal'),
      ESC_CODE = 27;

  // Closes modal if user's target is close button or modal overlay.
  function onModalClickHandler(e) {
    if (e.target.className == e.currentTarget.className)
    {
      e.preventDefault();
      e.currentTarget.style.display = 'none';
    }
  }

  if (modalForm) {
    (function handlers() {
      modalForm.addEventListener('click', onModalClickHandler);
      // Closes pop-up if user presses ESC and pop up is active
      window.onkeydown = function(e) {
        if (modalForm.style.display == 'block'
           && e.keyCode == ESC_CODE)
        {
          modalForm.style.display = 'none';
        }
      }

      window.onclick = function(e) {
        if (~event.target.className.indexOf("make-order")) {
          modalForm.style.display = 'block';
        }
      }
    }());
  }
}());
