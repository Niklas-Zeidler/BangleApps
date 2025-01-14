var counter = 30;
var counterInterval;
var file = require("Storage").open("coffee_log.csv","a");
var finish_message = "Coffee done";

function outOfTime() {
  Bangle.buzz();
  E.showPrompt(finish_message,{
  title:"Coffee is done!",
  buttons : {"Ok":true,"Again":false}
}).then(function(v) {
  if (v){load();}
  else {E.showPrompt(); mainMenu();}
});
}

function countDown() {
  counter--;
  // Out of time
  if (counter<=0) {
    clearInterval(counterInterval);
    counterInterval = undefined;
    setWatch(startTimer, (process.env.HWVERSION==2) ? BTN1 : BTN2);
    outOfTime();
    return;
  }

  g.clear();
  g.setFontAlign(0,0); // center font
  g.setFont("Vector",80); // vector font, 80px  
  // draw the current counter value
  g.drawString(counter,90,100);
  // optional - this keeps the watch LCD lit up
  Bangle.setLCDPower(1);
}

function startTimer(counter_start) {
  counter = counter_start;
  countDown();
  if (!counterInterval)
    counterInterval = setInterval(countDown, 1000);
}
function addCoffeeToLog(name){
  var csv = [
    0|getTime(), // Time to the nearest second
    name
  ];
  // Write data here
  file.write(csv.join(",")+"\n");
}
function startAeropress(){
  addCoffeeToLog('aeropress');
  finish_message = "aeropress ready for pressing!";
  startTimer(120);
}
function startEspresso(){
  addCoffeeToLog('espresso');
  finish_message = "Espresso blooming is done!";
  startTimer(10);
}
function startV60(){
  addCoffeeToLog('v60');
  finish_message = "Blooming is done!";
  startTimer(30);
}

function mainMenu() {
  var menuinfo = {
    "": { "title": /*LANG*/"Coffee logger" },
    "< Back": () => load(),
    /*LANG*/"Aeropress": () => startAeropress(),
    /*LANG*/"Espresso": () => startEspresso(),
    /*LANG*/"V60": () => startV60(),
  };
  E.showMenu(menuinfo);
}
// clear the screen
g.clear();

// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

mainMenu();