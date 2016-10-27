// artists.js
//==============================================

(function () {

  var s,
    artistsCreate = {
    /**
     * [settings Define all depencies, an variables for this module]
     */
    settings: {
      isInitialized: false,
      inputId: 'inputName'
    },
    /**
     * [init Init the module]
     */
    init: function init () {
      s = this.settings;

      if(!s.isInitialized) {
        s.isInitialized = true;
        this.bindPredictiveTypingOnInput(s.inputId);
      }
    },
    /**
     * [bindPredictiveTypingOnInput ]
     * @param  {string} inputId [The related input id]
     */
    bindPredictiveTypingOnInput: function bindPredictiveTypingOnInput(inputId) {

        var that = this;
        var currentFocusIndex = -1;

        var inputField = document.getElementById(inputId + 'Field');
        var input = document.getElementById(inputId);

        // var inputId = "predictiveBox" + $(input).attr('id');

        // var predictiveBox = $("<div data-input-related='" + inputId + "' class='predictive-box'></div>"),
            // links = "";

        var predictiveBox = document.createElement("div");
        predictiveBox.setAttribute('class', 'predictive-box');
        // // predictiveBox.innerHTML = 'test satu dua tiga';
        // document.body.appendChild(predictiveBox);

        var links = "";

        var ignoreKey = false;

        input.addEventListener("blur", function(e) {

          var search = e.target.value,
              searchLenght = search.length,
              keypress = e.keyCode;

          // Only call predictive search if user type 3 or more character
          if (searchLenght >= 3) {

            // Prevent navigation inside input
            if (ignoreKey) {
                e.preventDefault();
                return;
            }

            // Make the ajax call to Music Graph

            // var url = 'http://api.musicgraph.com/api/v2/artist/search?api_key=713461cbd12c05be798e1e46c4ccc733&name=' + search;

            var url = 'http://musicbrainz.org/ws/2/artist?query="' + search + '"AND comment:rapper&fmt=json';

            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp =  JSON.parse(request.response);
                // console.log(resp);

                // inputField.appendChild(predictiveBox);

                for (var i = resp.artists.length - 1; i >= 0; i--) {

                  console.log(resp.artists[i]);

                  // var predictiveBoxItem = document.createElement("a");
                  // predictiveBoxItem.setAttribute('class', 'predictive-box__item');
                  // predictiveBoxItem.innerHTML = "<strong class='name'>" + resp.artists[i].name + "</strong> ";
                  // predictiveBox.appendChild(predictiveBoxItem);
                }

              } else {
                // We reached our target server, but it returned an error
                console.log("error");
              }
            };

            request.onerror = function() {
              // There was a connection error of some sort
            };

            request.send();
          }
        });
    }
  };

  // Init the module
  artistsCreate.init();

})();