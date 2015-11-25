'use strict';
/* global FavoritesItem, FavoritesStore */
(function (exports) {


  function FavoriteItem(item) {
    if (item === null || item === undefined){
      return false;
    }
    this.index = item.getIndex();
    //creating favorite element
    var favoriteElem = document.createElement('div');
    favoriteElem.className = 'fav-item';
    favoriteElem.setAttribute('data-index', this.index);
    favoriteElem.innerHTML = "<img class='fav-icon'></img>" +
            "<img class='fav-small-icon'><br></img>" +
            "<span class='title'></span>" + "<br>" +
            "<span class='subtitle'></span>";

    favoriteElem.classList.add('hidden');
    var favoriteList = document.getElementById('favorite-list');
    favoriteList.appendChild(favoriteElem);

    this.element = favoriteElem;
    this.icon = this.element.querySelector('.fav-icon');
    //this.smallIcon = this.element.querySelector('.fav-small-icon');
    this.title = this.element.querySelector('.title');
    this.subtitle = this.element.querySelector('.subtitle');

    this.itemEntry = item;
    this.title.textContent = this.itemEntry.title;
    this.subtitle.textContent = this.itemEntry.subTitle;
    this.icon.src = this.itemEntry.image;
    //this.smallIcon.src = this.itemEntry.icon;
  }

  function FavoriteManager() {
    if (FavoriteManager.instance) {
      return FavoriteManager.instance;
    }

    FavoriteManager.instance = this;
    this.favStoreName = null;
    this.items = [];
  }

  FavoriteManager.prototype = {
    clear: function() {
      var elements = document.getElementsByClassName("fav-item");
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    },

    setStoreName: function(store) {
      if (store) {
        this.favStoreName = store;
      }
    },

    openFavoritesScreen: function(favorites, store, appIcon) {
      this.setStoreName(store);

      function addDefaultItem(state) {
        var addFavoriteElement = document.createElement('div');
        addFavoriteElement.className = 'fav-item';
        addFavoriteElement.classList.add('default');
        addFavoriteElement.classList.add(state);
        addFavoriteElement.setAttribute('data-index', this.items.length);
        addFavoriteElement.innerHTML = "<span class='title'></span>";
        var favList = document.getElementById('favorite-list');
        favList.appendChild(addFavoriteElement);
        this.element = addFavoriteElement;
        this.title = this.element.querySelector('.title');
        this.title.textContent = "Add Favorite";
      };

      function displayApplicationIcon(url) {
        var appIconElement = document.createElement('div');
        appIconElement.className = 'fav-item';
        appIconElement.classList.add('app-icon');
        appIconElement.innerHTML = "<img class='fav-app-icon'><br></img>";
        var favoriteScreen = document.getElementById('favorite-screen');
        favoriteScreen.appendChild(appIconElement);
        this.element = appIconElement;
        this.icon = this.element.querySelector('.fav-app-icon');
        this.icon.style.visibility = "visible";
        this.icon.src = url;
      };

      // first item is app icon
      displayApplicationIcon.call(this, appIcon);

      if (favorites) {
        for (var i = 0; i < favorites.length; i++) {
          this.items[i] = new FavoriteItem(favorites[i]);
        }
        addDefaultItem.call(this, 'hidden');
      } else {
        // show 'add favorites' icon
        addDefaultItem.call(this, 'selected');
      }
    },

    deleteAllFavorites: function() {
      var self = this;

      if (self.items.length === 0) {
          console.log("There are no favorites items to delete");
          return;
      }

      var store = new FavoritesStore(self.favStoreName, 'fav_actions');
      store.clearAllFavorites().then(function() {
      console.log("clearAllFavorites completed. ");
      for (var i=0; i < self.items.length; i++) {
        app.updateFavorites();
      }
    }).catch(function(reason) {
      console.log("clearAllFavorites failed");
    });
    }
  };

  exports.FavoriteManager = FavoriteManager;
})(window);
