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

function URLEncode (clearString) {
  var output = '';
  var x = 0;
  clearString = clearString.toString();
  var regex = /(^[a-zA-Z0-9_.]*)/;
  while (x < clearString.length) {
    var match = regex.exec(clearString.substr(x));
    if (match != null && match.length > 1 && match[1] != '') {
    	output += match[1];
      x += match[1].length;
    } else {
      if (clearString[x] == ' ')
        output += '%20';
      else {
        var charCode = clearString.charCodeAt(x);
        var hexVal = charCode.toString(16);
        output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
      }
      x++;
    }
  }
  return output;
}


$(function() {

  $("#order").button();

  var LedWall = Backbone.Model.extend({
    //updateBOM: function(){
    //  console.log("updateBOM");
    //},
    log: function(){
      console.log("ledwall: " + this.get("height") + "x" + this.get("width"));
      console.log("stock: " + this.get("stockArduino") + " - " +  this.get("stockMax7313") + " - " + this.get("stock42"));
    },
    update: function(){
      this.set({
        height: parseInt($("#resizable").css("height"), 10),
        width: parseInt($("#resizable").css("width"), 10)
      });
      this.updateArduino();
      this.updateBOM();
    },
    updateBOM: function(){

      if(!(this.get("previousStock") === this.get("stock42"))){

        this.set({previousStock: this.get("stock42")});

        var arduinoUnitPrice = 23.95;
        var arduinoUnits = this.get("stockArduino") ;
        if(arduinoUnits >= 5 && arduinoUnits < 10){
          arduinoUnitPrice = 23.47
        } else if(arduinoUnits >= 10 && arduinoUnits < 20){
          arduinoUnitPrice = 22.75
        } else if(arduinoUnits >= 20){
          arduinoUnitPrice = 22.03
        }
        var priceArduino = arduinoUnits * arduinoUnitPrice;

        var max7313UnitPrice = 9.95;
        var max7313Units = this.get("stockMax7313");
        if(max7313Units >= 10){
          max7313UnitPrice = 9.45;
        }
        var priceMax7313 = max7313Units * max7313UnitPrice;

        var fourtytwoUnitPrice = 6;
        var fourtytwoUnits = this.get("stock42");
        if(fourtytwoUnits >= 10){
          fourtytwoUnitPrice = 5.60;
        }
        var price42 = fourtytwoUnits * fourtytwoUnitPrice;

        var cableUnitPrice = 4.10;
        var cableUnits = Math.ceil(this.get("stock42") / 20);
        if(cableUnits >= 10){
          cableUnitPrice = 3.70;
        }
        var priceCable = cableUnits * cableUnitPrice;

        var priceTotal = priceArduino + priceMax7313 + price42 + priceCable;

        this.set({
          stockArduino: arduinoUnits,
          stockMax7313: max7313Units,
          stock42: fourtytwoUnits,
          stockCable: cableUnits,
        });

        $("#stockArduino").html("x" + arduinoUnits);
        $("#priceArduino").html(priceArduino.formatMoney(2, ".", ""));
        $("#stockMax7313").html("x" + max7313Units);
        $("#priceMax7313").html(priceMax7313.formatMoney(2, ".", ""));
        $("#stock42").html("x" + fourtytwoUnits);
        $("#price42").html(price42.formatMoney(2, ".", ""));
        $("#stockCable").html("x" + cableUnits);
        $("#priceCable").html(priceCable.formatMoney(2, ".", ""));

        $("#priceTotal").html(priceTotal.formatMoney(2, ".", ""));

        var nbLeds = fourtytwoUnits * 8;
        $("#nbLeds").html(nbLeds);
        $("#funFactor").html(Math.ceil(fourtytwoUnits / 3 * Math.floor((Math.random() + 1)*11)));

        var mailSubject = "42 Calculator - " + nbLeds + " LEDs";
        var mailBody = "Hi Snootlab Team,\n\n== Please comment here ==\n\n\n\n\n== End comments ==\n\n";
        mailBody += "Here is the list of componants I need to built a " + nbLeds + " led wall:\n\n";
        mailBody += "- " + priceArduino.formatMoney(2, ".", "") + "e x" + arduinoUnits + " Arduino Uno\n";
        mailBody += "- " + priceMax7313.formatMoney(2, ".", "") + "e x" + max7313Units + " I2C Pwm Driver\n";
        mailBody += "- " + price42.formatMoney(2, ".", "") + "e x" + fourtytwoUnits + " TheFortyTwo\n";
        mailBody += "- " + priceCable.formatMoney(2, ".", "") + "e x" + cableUnits + " Kit flat wires for I2C bus\n\n";
        mailBody += "Total: " + priceTotal.formatMoney(2, ".", "") + "e\n\n";
        mailBody += "Thanks Snootlab :)";
        $("#order").attr("href", "mailto:contact@snootlab.com?subject=" + URLEncode(mailSubject) + "&body=" + URLEncode(mailBody));
      }
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
    grid: ledwall.dimensions(),
    minWidth: ledwall.dimensions()[0],
    minHeight: ledwall.dimensions()[1],
    maxWidth:756
  });

  $( "#resizable" ).bind( "resize", function(event, ui) {
    $("#ledwall").css("background-image", "url()");
    ledwall.update();
  });

  $(".changeWallAspect").live("click", function(){
    
    var aspect = $(this).attr("data-aspect");
    ledwall.set({aspect: aspect});

    $( "#resizable" ).resizable( "option", "grid", ledwall.dimensions() );
    $( "#resizable" ).resizable( "option", "minWidth", ledwall.dimensions()[0] );
    $( "#resizable" ).resizable( "option", "minHeight", ledwall.dimensions()[1] );

    $( "#resizable" ).css("background-image", "url(img/42_" + aspect + ".png)");
    $( "#resizable" ).css("height", 336);
    $( "#resizable" ).css("width", 168);

    $("#ledwall").css("background-image", "url(img/drag_here.png)");

    ledwall.update();
  });

  ledwall.update();
});

