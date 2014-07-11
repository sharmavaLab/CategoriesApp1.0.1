var gameCache = new Object();

function GameData(id){
	this.id = id;
	this.gameBlock = new CategoryGameBlock();
	this.controlBlock = new GameControlBlock();
	this.instructionBlock = new InstructionBlock();
	this.instructionContent = null;
	this.categoryNItemString = null;
	this.orderType = null;
	this.count = 0;
	this.categories = new Array();
	this.items = new Array();
	this.itemsMap = new Object();
    this.move = 0;
}
/***********************************************************************************************/
//default values for all the objects
function CategoryGameBlock(){
	 this.id=null;
}

function GameControlBlock(){
	//data members with default values
	this.id = null;
	this.sound = false;
	this.level = 1;
	this.score = 0;
}

function InstructionBlock(){
   this.instructionBlockContent = null;
}

/***********************************************************************************************/
//starting point for the application.
function categorizeApp(divId, instructionURL, catNItemString, orderType, count){
	instantiateGameBlock(divId, instructionURL, catNItemString, orderType, count);
}

function instantiateGameBlock(divId, instructionContent, catNItemString, orderType, count){
	var gameDiv = document.getElementById('divId');
    var instructionHTML = instructionContent;
	if(gameDiv == undefined){
		   gameDiv = document.createElement('div');
		   gameDiv.id = divId;
		   document.body.appendChild(gameDiv);
	}
	gameDiv.className = 'layout';

	var gameObject  = new GameData(divId);
	gameObject.instructionContent = instructionHTML;
	gameObject.categoryNItemString = catNItemString;
	gameObject.orderType = orderType;
	gameObject.count = count;
	gameObject.instructionBlock.instructionBlockContent = gameObject.instructionContent;
	gameCache[gameObject.id] = gameObject;
	displayInstructions(gameObject,gameDiv);
	disPlayStartGame(gameDiv);
}

function displayInstructions(obj,gameDiv){
	var instrBlockDiv = document.createElement('div');
	instrBlockDiv.id = gameDiv.id+"#gameBlock";
	instrBlockDiv.className = "gameDiv";
	instrBlockDiv.innerHTML = obj.instructionContent;
	gameDiv.appendChild(instrBlockDiv);
}

function disPlayStartGame(gameDiv){
	var gameControlPanel = document.createElement('div');
	gameControlPanel.id = gameDiv.id+"#controlPanel";
	gameControlPanel.className = "gameControlPanel";
	var startButton = document.createElement('button');
	startButton.setAttribute("onclick","startGame("+gameDiv.id+")");
	startButton.innerHTML = "START";
	startButton.className = "startButton";
	gameControlPanel.appendChild(startButton);
	gameDiv.appendChild(gameControlPanel);

}

function startGame(id){
	//alert('function called'+ id);
	populateCategoriesItems(id);
	shuffle(id);
	//create category and item map
    generateGameLayout(id);
}

function generateGameLayout(id){
	var gameDiv = document.getElementById(id+"#gameBlock");
		gameDiv.innerHTML = "";

	var gameControlPanel = document.getElementById(id+"#controlPanel");
	gameControlPanel.innerHTML = "";

	var gameDiv = document.getElementById(id+"#gameBlock");
	var dataObject = gameCache[id];

	var itemDiv = document.createElement('div');
	itemDiv.className = 'itemLayout';
	var itemLable = document.createElement('div');
	itemLable.innerHTML = dataObject.items[dataObject.move];
	itemDiv.appendChild(itemLable);

	var categoriesDiv = document.createElement('div');
	categoriesDiv.className = 'categoryLayout';

    for(var count=0;count<dataObject.categories.length;count++){
		var catValue = document.createElement('div');
		var val = dataObject.categories[count];
		catValue.className = "categoryDiv";
	    catValue.innerHTML = val;
	    catValue.onclick = function(){
			checkMove(id,val);
		}
	    categoriesDiv.appendChild(catValue);
	}
	gameDiv.appendChild(itemDiv);
	gameDiv.appendChild(categoriesDiv);
}

function checkMove(id,value){
	var gameObject = gameCache[id];
	if(gameObject.itemsMap[gameObject.items[gameObject.move]] === value){
	   alert('correct');
	}else{
		alert('incorrect');
	}
	gameObject.move = gameObject.move + 1;

	if(gameObject.move < gameObject.count){
		setTimeout(function() {
					generateGameLayout(id);
			}, 2000);
	}
}

function createGameControlBlock(id){
	//Add sound
	//Add level
	//Add score
	//Other
}

function populateCategoriesItems(id){
	var obj = gameCache[id];
	var categoryItemString = obj.categoryNItemString;
	var catItemCollection = categoryItemString.split('<#cat#>');
	for(var count=0;count<catItemCollection.length;count++){
	 var catg = catItemCollection[count].split('\n');
	 obj.categories[count] = catg[0];
	 for(var index=1;index<catg.length;index++){
		 obj.itemsMap[catg[index]] = catg[0];
		 obj.items.push(catg[index]);
	 }
   }


}




function addLevelPanel(controlPanel){
	var levelPanel = document.createElement('div');
    levelPanel.id = controlPanel.id+"#lvl_p";
    levelPanel.className = "controlPanelElement";

    var levelElement = document.createElement('div');
    var increaseLable = document.createElement('lable');
    increaseLable.innerHTML = " + ";
    //increaseLable.setAttribute("onclick",'increaseLevel('++')');

    var decreaseLable = document.createElement('lable');
    decreaseLable.innerHTML = " - ";
    //decreaseLable.setAttribute("onclick",'');

    var levelDisplay = document.createElement('lable');
    levelDisplay.innerHTML = " Level 1 ";

    levelPanel.appendChild(increaseLable);
    levelPanel.appendChild(levelDisplay);
    levelPanel.appendChild(decreaseLable);

    controlPanel.appendChild(levelPanel);
}

function shuffle(id) {
	var object = gameCache[id];

	var counter = object.items.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = object.items[counter];
        object.items[counter] = object.items[index];
        object.items[index] = temp;

    }
 //   alert('end');
}