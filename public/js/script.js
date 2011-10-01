/* Author:

*/

$(function() {
  var LedWall = Backbone.Model.extend({
    //updateBOM: function(){
    //  console.log("updateBOM");
    //},
    log: function(){
      console.log("ledwall: " + this.get("height") + "x" + this.get("width"));
    }
  });

  window.ledwall = new LedWall({
    height: parseInt($("#resizable").css("height"), 10),
    width: parseInt($("#resizable").css("width"), 10)
  });

  $("#resizable").resizable({
    containment: "#ledwall"
  });

  $( "#resizable" ).bind( "resize", function(event, ui) {
    ledwall.set({height: parseInt($("#resizable").css("height"), 10)});
    ledwall.set({width: parseInt($("#resizable").css("width"), 10)});
    ledwall.log();
  });

});

