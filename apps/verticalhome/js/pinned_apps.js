'use strict';

(function (exports) {

  function PinnedAppItem(index, entry) {
    if (index === null || index === undefined){
      return false;
    }
    this.index = index;
    //creating pinned app element
    var pinnedElem = document.createElement('div');
    var pinnedAppIcon = document.createElement('img');
    var pinnedAppTitle = document.createElement('span');
    var pinnedList = document.getElementById('pinned-apps-list');
    var moreAppsLi = document.getElementById('moreApps');

    pinnedElem.className = 'pinned-app-item';
    pinnedAppIcon.className = 'pinned-app-icon';
    pinnedAppTitle.className = 'title';

    pinnedElem.setAttribute('data-index', this.index);
    pinnedElem.appendChild(pinnedAppIcon);
    pinnedElem.appendChild(pinnedAppTitle);

    pinnedList.insertBefore(pinnedElem, moreAppsLi);

    this.element = pinnedElem;
    this.icon = pinnedAppIcon;
    this.title = pinnedAppTitle;

    if (entry) {
      this.entry = entry;
      this.entry.index = this.index;
      this.targetApp = app.getAppByURL(this.entry.manifestURL);
      this.render();

      //load favorites:
      this.favStoreName = "settings"; //TODO: get fav store name
      this.loadFavorites(this.favStoreName);
    }
    this.favoritesList = [];
  }

  PinnedAppItem.prototype = {
    render: function() {

      var self = this;
      function getName() {
        var name = self.entry.locales[document.documentElement.lang].name;
        return  name ? name : self.entry.name;
      }

      //TODO: it is necessary to delete elements from pinned app list from
      //page not hide them and refresh target app for example when application
      //is being uninstalled.
      if(this.targetApp) {
        var manifest = this.targetApp.manifest;
        var entry_point = this.entry.entry_point;
        var appIcons = [];

        this.icon.style.visibility = 'visible';
        this.title.style.visibility = 'visible';

        if (this.entry){
          this.element.addEventListener('click', this);
          this.element.addEventListener('open-favorites', this);
          this.element.addEventListener('show-favorite-icon', this);
          this.element.addEventListener('delete-all-favorites', this);

          this.element.dataset.manifesturl = this.entry.manifestURL;
          this.element.dataset.entrypoint = this.entry.entry_point;

          if (manifest.entry_points) {
            if (entry_point) {
              appIcons = manifest.entry_points[entry_point].icons;
            }else{
              console.error('Entry point must be defined');
            }
          } else {
            appIcons = manifest.icons;
          }

          for (var size in appIcons) {
            if (size >= 75) {
              var mainURL = this.entry.manifestURL.split('/');
              mainURL.splice(-1, 1);
              this.icon.src = mainURL.join('/') + appIcons[size];
              break;
            }
          }

          if (this.entry.locales) {
            this.title.textContent = getName();
          } else {
            this.entry.locales = manifest.entry_points && entry_point ?
              manifest.entry_points[entry_point].locales :
              manifest.locales;
            this.title.textContent = getName();
          }
        }

      } else {
        this.icon.style.visibility = 'hidden';
        this.title.style.visibility = 'hidden';
      }
    },

    refreshDomElem: function(elem){
      this.element = elem;
      this.icon = this.element.querySelector('.pinned-app-icon');
      this.title = this.element.querySelector('.title');
      this.render();
    },

    clear: function() {
      this.entry = {
        entry_point: null,
        name: null,
        manifest: null,
        index: this.index
      };
      this.element.removeEventListener('click', this);
      this.element.removeEventListener('open-favorites', this);
      this.element.removeEventListener('show-favorite-icon', this);
      this.targetApp = null;
      this.favoritesList = null;
    },

    launch: function() {
      if(!this.targetApp) {
        return;
      }

      if(this.entry.entry_point) {
        this.targetApp.launch(this.entry.entry_point);
      } else {
        this.targetApp.launch();
      }
    },

    getEntry: function() {
      return this.entry;
    },

    save: function() {
      app.savePinnedAppItem(this.entry);
    },

    handleEvent: function(e) {
      switch(e.type) {
        case 'click':
          this.launch();
          break;

        case 'open-favorites':
          app.openFavoriteList(this.favoritesList, this.favStoreName, this.icon.src);
          break;

        case 'show-favorite-icon':
          var iconSrc = "/style/images/add_75px.png";
          if (this.favoritesList && (this.favoritesList.length > 0)) {
            iconSrc = this.favoritesList[this.favoritesList.length-1].image;
          }
          app.pinFavoriteIcon(iconSrc);
          break;
      }
    },

    loadFavorites: function(dataStoreName) {
     var self = this;
     self._favoriteStore = new FavoritesStore(dataStoreName, 'fav_actions');
      if (self._favoriteStore) {
        self._favoriteStore.getAllFavorites().then(function(items) {
          self.favoritesList = items;
      }).catch(function(reason) {
        console.log("Favorites not loaded something went wrong");
      });
      } else {
        console.log("Cannot get favorites store for " +dataStoreName);
      }
    },
  };

  function PinnedAppsManager() {
    if (PinnedAppsManager.instance){
      return PinnedAppsManager.instance;
    }

    PinnedAppsManager.instance = this;

    this.items = [];
  }

  PinnedAppsManager.prototype = {
    init: function () {
      var pinnedAppsList = app.getPinnedAppsList();
      for (var i = 0; i < pinnedAppsList.length; i++) {
        this.items[i] = new PinnedAppItem(i, pinnedAppsList[i]);
      }

      this.items.sort(function(elem1, elem2) {
        return elem1.index - elem2.index;
      });
    }
  };

  exports.PinnedAppsManager = PinnedAppsManager;
})(window);
