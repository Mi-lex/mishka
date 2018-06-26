'use strict';

(function modalHandlers() {
  var modalShowBtn = document.querySelector('.popular-product__order'),
      modalForm = document.querySelector('.modal'),
      ESC_CODE = 27;

  // Closes modal if user's target is close button or modal overlay.
  function onModalClickHandler(e) {
    if (e.target.className == e.currentTarget.className)
    {
      e.preventDefault();
      e.currentTarget.style.display = 'none';
    }
  }

  modalForm.addEventListener('click', onModalClickHandler);

  modalShowBtn.addEventListener('click', function() {
    modalForm.style.display = 'block';
  });

  // Closes map pop-up if user presses ESC and pop up is active
  window.onkeydown = function(e) {
    if (modalForm.style.display == 'block'
       && e.keyCode == ESC_CODE)
    {
      modalForm.style.display = 'none';
    }
  }
}());
