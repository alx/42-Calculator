/* Author:

*/

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/number/fmt-money [rev. #2]

Number.prototype.formatMoney = function(c, d, t){
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
    + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

$(function() {

  var LedWall = Backbone.Model.extend({
    //updateBOM: function(){
    //  console.log("updateBOM");
    //},
    log: function(){
      console.log("ledwall: " + this.get("height") + "x" + this.get("width"));
      console.log("stock: " + this.get("stockArduino") + " - " +  this.get("stockMax7313") + " - " + this.get("stock42"));
    },
    update: function(){
      var height = parseInt($("#resizable").css("height"), 10);
      var width = parseInt($("#resizable").css("width"), 10);
      this.set({
        height: height,
        width: width
      });
      this.updateArduino();
      this.updateBOM();
    },
    updateBOM: function(){

      var priceArduino = this.get("stockArduino") * 23.95;
      var priceMax7313 = this.get("stockMax7313") * 9.95;
      var price42 = this.get("stock42") * 6;
      var priceTotal = priceArduino + priceMax7313 + price42;

      $("#stockArduino").html(this.get("stockArduino"));
      $("#priceArduino").html(priceArduino.formatMoney(2, ".", ""));
      $("#stockMax7313").html(this.get("stockMax7313"));
      $("#priceMax7313").html(priceMax7313.formatMoney(2, ".", ""));
      $("#stock42").html(this.get("stock42"));
      $("#price42").html(price42.formatMoney(2, ".", ""));

      $("#priceTotal").html(priceTotal.formatMoney(2, ".", ""));

      $("#nbLeds").html(this.get("stock42") * 8);
    },
    update42: function(){
      var dimension = this.dimensions();
      this.set({stock42: (this.get("width") / dimension[0]) * (this.get("height") / dimension[1])});
    },
    updateMax7313: function(){
      this.update42();
      this.set({stockMax7313: Math.ceil(this.get("stock42") / 2)});
    },
    updateArduino: function(){
      this.updateMax7313();
      this.set({stockArduino: Math.ceil(this.get("stockMax7313") / 64)});
    },
    dimensions: function(){
      switch(this.get("aspect")) {
        case 'small':
          output = [7, 56];
          break;
        case 'medium':
          output = [21, 168]
          break;
        default:
          output = [42, 336]
      }
      return output;
    }
  });

  window.ledwall = new LedWall({
    height: parseInt($("#resizable").css("height"), 10),
    width: parseInt($("#resizable").css("width"), 10),
    aspect: "large"
  });

  $("#resizable").resizable({
    containment: "#ledwall",
    grid: ledwall.dimensions()
  });

  $( "#resizable" ).bind( "resize", function(event, ui) {
    ledwall.update();
  });

  $(".changeWallAspect").live("click", function(){
    var aspect = $(this).attr("data-aspect");
    ledwall.set({aspect: aspect});
    ledwall.update();
    $( "#resizable" ).resizable( "option", "grid", ledwall.dimensions() );
    $( "#resizable" ).css("background-image", "url(/img/42_" + aspect + ".png)");
  });

  ledwall.update();
});

