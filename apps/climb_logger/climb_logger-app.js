// place your const, vars, functions or classes here
var grade = 15;
var file = require("Storage").open("climb_log.csv","a");
const climb_styles = ["slab","vertical","overhang"];
const sport_styles = ["boulder","sport","trad","DWS"];
const fb_letters = ["a","b","c"];
const loc_str = ["indoors","outdoors"];
var style = 0;
var sport = 0;
var success = true;
var loc = 0;

function format_fb(v){
  var remainder = v % 3;
  var number_grade = Math.floor(v/3);
  return number_grade + fb_letters[remainder];
}
function addClimbToLog(){
  Bangle.buzz();
  var csv = [
    0|getTime(), // Time to the nearest second
    format_fb(grade),
    climb_styles[style],
    success,
    sport_styles[sport],
    loc_str[loc]
  ];
  // Write data here
  file.write(csv.join(",")+"\n");
}
function mainMenu(){
  var menuinfo ={
    "" : { title : "-- ClimbLogger --",
          back : function() { addClimbToLog(grade,style); } },
    "difficulty":{
        value: grade,
        min: 1,
        step: 1,
        max: 27,
        wrap: true,
        onchange: v => grade = v,
        format: v => format_fb(v), 
    },
    "Style":{
      value: style,
      min: 0,
      max: 2,
      wrap: false,
      onchange: v => style = v,
      format: v => climb_styles[v], 
    },
    /*LANG*/"Success": {
        value: success,
        onchange: v => success = v
    },
    "Discipline":{
      value: sport,
      min: 0,
      max: 3,
      wrap: false,
      onchange: v => style = v,
      format: v => sport_styles[v], 
    },
    "Where":{
      value: loc,
      min: 0,
      max: 1,
      wrap: false,
      onchange: v => loc = v,
      format: v => loc_str[loc], 
    },
  };


  E.showMenu(menuinfo);
}

// clear the screen
g.clear();

var n = 0;

// redraw the screen
function draw() {
  g.reset().clearRect(Bangle.appRect);
  g.setFont("6x8").setFontAlign(0,0).drawString("Up / Down",g.getWidth()/2,g.getHeight()/2 - 20);
  g.setFont("Vector",60).setFontAlign(0,0).drawString(n,g.getWidth()/2,g.getHeight()/2 + 30);
}

// Respond to user input
Bangle.setUI({mode: "updown"}, function(dir) {
  if (dir<0) {
    n--;
    draw();
  } else if (dir>0) {
    n++;
    draw();
  } else {
    n = 0;
    draw();
  }
});

// First draw...
draw();

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

mainMenu();
