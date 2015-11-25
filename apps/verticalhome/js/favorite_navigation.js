(function(exports) {

  /**
   * This is FavoriteNavigation's constructor.
   * @param {Object} list [DOM container that contains favorite elements]
   */
  function FavoriteNavigation(list) {
    if (!list && typeof list !== 'object') {
      console.log('List of favorite apps must be an object');
      return;
    }

    this.elemList = list;
    //window.removeEventListener('keydown', this);
    //window.addEventListener('keydown', this);
  };

  FavoriteNavigation.prototype = {

    selector: '',
    elements: null,
    focusedElemIndex: 0,
    nextElementIndex: 0,
    elemList: null,

    init: function init() {
      if (!this.selector) {
        console.log('Can not work without selector');
        return;
      }

      this.elements = Array.prototype.slice.call(document.querySelectorAll(this.selector));

      if (!this.elements && !this.elements.length) {
        console.log('Can not find any elements by this selector');
        return;
      }
      this.nextElementIndex = this.focusedElemIndex + 1;

      //TODO: set existing favorite as focused and the first element.
      if (this.elements.length >1) {
        this.elements[this.nextElementIndex].classList.remove('hidden');
      }
      // set focused element
      this.elements[this.focusedElemIndex].classList.remove('hidden');
      this.elements[this.focusedElemIndex].classList.add('selected');
    },

    moveRight: function moveRight() {
      var moved = this.elemList.querySelector('.moved');
      if (moved) {
          moved.classList.add('hidden');
          moved.classList.remove('moved');
      }
      //set focused item
      this.elements[this.focusedElemIndex].classList.remove('hidden');
    },

    moveLeft: function moveLeft() {
      this.elements[this.focusedElemIndex-1].classList.add('hidden');
      if (this.elements[this.focusedElemIndex+1] !== undefined) {
          this.elements[this.focusedElemIndex+1].classList.remove('hidden');
      }
    },

    /**
     * Handle event keydown
     * @param  {[Object]} e [default object]
     * @return {[nothing]}   [nothing]
     */
    handleEvent: function(e) {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (this.focusedElemIndex == this.elements.length-1) {
              //There are no elements in favorite list
              break;
          }

          this.focusedElemIndex++;
          this.elements[this.focusedElemIndex].classList.add('selected');
          this.moveLeft();
        break;

        case 'ArrowRight':
          e.preventDefault();
          console.log('FavoriteNavigation.handleEvent ArrowRight');
          if (this.focusedElemIndex == 0) {
            app.hideFavorites();
            break;
          }

          if (this.elements[this.focusedElemIndex+1] !== undefined) {
            this.elements[this.focusedElemIndex+1].classList.add('moved');
          }
          this.elements[this.focusedElemIndex].classList.remove('selected');
          this.focusedElemIndex--;
          this.moveRight();
        break;

        case 'Accept':
          e.preventDefault();
          if (this.focusedElemIndex === (this.elements.length-1)) {
              //invoke Add Favorite process
          } else {
              //TODO: pin favorite and go to Home screen
          }

          break;
      }
    },

    /**
    * Setter to set selector
    * @param  {string} selector [selector that the navigation can take]
    * @return {[nothing]}          [nothing]
    */
    set points_selector(selector) {
      this.selector = selector;
      this.init();
    }
  };

   exports.FavoriteNavigation = FavoriteNavigation;

}(window));
