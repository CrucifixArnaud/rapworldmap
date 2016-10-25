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
        // this.bindPredictiveTypingOnInput(s.inputId);
      }
    },
    /**
     * [bindPredictiveTypingOnInput ]
     * @param  {string} inputId [The related input id]
     */
    bindPredictiveTypingOnInput: function bindPredictiveTypingOnInput(inputId) {

        var that = this;
        var currentFocusIndex = -1;

        var input = document.getElementById(inputId);

        // var inputId = "predictiveBox" + $(input).attr('id');

        // var predictiveBox = $("<div data-input-related='" + inputId + "' class='predictive-box'></div>"),
            // links = "";

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

            var url = 'http://api.musicgraph.com/api/v2/artist/search?api_key=713461cbd12c05be798e1e46c4ccc733&name=' + search;

            var request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function() {
              if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;



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