"use strict";

(function menu() {
  var menu = document.querySelector('.page-header__menu'),
      toggle = menu.querySelector('.page-header__menu-toggle');

  menu.classList.remove('page-header__menu--nojs');
  menu.classList.remove('page-header__menu--opened');
  menu.classList.add('page-header__menu--closed');

  toggle.addEventListener('click', function() {
    menu.classList.toggle('page-header__menu--opened');
    menu.classList.toggle('page-header__menu--closed');
  });
}());
