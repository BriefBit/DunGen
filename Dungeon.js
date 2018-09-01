// DunGen.js 
// written by Samuel Becker v0.5 April 2nd, 2016
// v0.6 added bitmasking function to output to drawmap (need to update it for multiple tiletypes)
// Procedural dungeon generation



var DunGen = function(width, height, maxFeatures) {


	var EARTH = -1;
	var FLOOR = 1;
	var WALL = 2;
	var CORNER = 3;
	var DOOR = 4;
	var MIN_ROOM_HEIGHT = 10;
	var MIN_ROOM_WIDTH = 10;
	var MAX_ROOM_WIDTH = 16;
	var MAX_ROOM_HEIGHT = 16;

	var MIN_HALL_LENGTH = 6;
	var MAX_HALL_LENGTH = 24;

    

    var wallCoords;
    var wallSide;
    this.width = width;
    this.height = height;

    var randomLength;
    var randomWidth = 0;
    var randomHeight = 0;

    var featureCount = 0; //number of features on map (rooms and halls) 
    var centerX = Math.round(this.width / 2);
    var centerY = Math.round(this.height / 2);

    var map = [];
    for (var i = 0; i < width; i++) {
        map[i] = [];
        for (var j = 0; j < height; j++) {
            map[i][j] = EARTH;
        }
    }


    //functions
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };


    var pickFeature = function() { // return int 0 or 1 for now (that's why not a bool) randomly choose feature
        var feature = Math.round(getRandomInt(0, 100));
        if (feature <= 75) {
            return (0); //room
        } else if (feature > 75 && feature < 90){
        	return (1);
        } else {
        	return (2);
        }
    };



	


    var findWall = function() { // RANDOMLY loop over entire map until a wall cell is found (2) return cell coords (?)

        this.width = width - 2; //minus 2 to offset the area checked
        this.height = height - 2;
        var randomX = getRandomInt(1, this.width);
        var randomY = getRandomInt(1, this.height);
        var wallCoords = [];
        while (map[randomX][randomY] != WALL){
            randomX = getRandomInt(1, this.width);
            randomY = getRandomInt(1, this.height);
        }
        wallCoords[0] = randomX;
        wallCoords[1] = randomY;

        return (wallCoords);
    };




    var checkSide = function(x, y) { // figure out what side of the room the wall is on
        var side; // 0,1,2,3       0 = right, 1 = left, 2 = top, 3 = bottom 
        this.x = x;
        this.y = y;

        if (map[this.x + 1][this.y] == EARTH) {
            side = 0;
        }
        if (map[this.x - 1][this.y] == EARTH) {
            side = 1;
        }
        if (map[this.x][this.y - 1] == EARTH) {
            side = 2;
        }
        if (map[this.x][this.y + 1] == EARTH) {
            side = 3;
        }
        return (side);
    };

	var makeCircle = function(xCenter,yCenter,radius,tileType){
		var r = radius;


		for (x = xCenter - r ; x <= xCenter; x++){
  	  		for (y = yCenter - r ; y <= yCenter; y++){
        	// we don't have to take the square root, it's slow
        		
        		if ((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter) < r*r ){
           			xSym = xCenter - (x - xCenter);
            		ySym = yCenter - (y - yCenter);
            		map[x][y] = tileType;         		
            		map[x][ySym] = tileType;
            		map[xSym][y] = tileType;
            		map[xSym][ySym] = tileType;
            		if ((x - xCenter)*(x - xCenter) + (y - yCenter)*(y - yCenter) < (r-1)*(r-1) ){
            		map[x][y] = FLOOR;         		
            		map[x][ySym] = FLOOR;
            		map[xSym][y] = FLOOR;
            		map[xSym][ySym] = FLOOR;
        			}
            		// (x, y), (x, ySym), (xSym , y), (xSym, ySym) are in the circle
        		}
    		}
		}
		
	}
	
	/* 
	THIS RETURNS NEIGHBOR COUNT OF A GIVEN CELL, not used as of yet. 
	but I'm lazy and don't want to rewrite it if I do need it
	
	var neighborCount = function(x,y,neighborType){
		var neighborCount = 0;
		for(var i = -1; i < 2; i ++){
			for(var j = -1; j < 2; j ++){
				if(x+i < map.length && y+j < map[0].length){
				if(map[x + i][y + j] == neighborType){
					neighborCount ++;
				}
			}
			}
		}
		return neighborCount;
	}
	*/


    var makeRoom = function(x, y, width, height, direction) {
	




        var xIndex = 0;
        var yIndex = 0;
        var xOffset = 0;
        var yOffset = 0;
        var colCount = 0;
        var rowCount = 0;
        var tileType = 0;

        //  this.hallLength = hallLength;
        //this.hallWidth = 4;
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;
        this.direction = direction;

		// 


        for (i = 0; i <= this.width; i++) {
            for (j = 0; j <= this.height; j++) {

                switch (this.direction) { //change variables around depending on direction 
                						// direction ROTATES room or hallway so, width can be along both the x-axis AND y-axis
                    case 0:
                        xIndex = i;
                        yIndex = j;
                        
        
                        
                        xOffset = this.x;
                        yOffset = this.y - Math.round(this.height / 2);
                        rowCount = this.height;
                        colCount = this.width;
						map[x + 1][y] = FLOOR;
                        				map[x - 1][y] = FLOOR;


                        break;
                    case 1:
                        xIndex = i;
                        yIndex = j;
                        xOffset = this.x - this.width;
                        yOffset = this.y - Math.round(this.height / 2);
                        rowCount = this.height;
                        colCount = this.width;
                        				map[x + 1][y] = FLOOR;
                        				map[x - 1][y] = FLOOR;
                        break;
                    case 2:
                        xIndex = j;
                        yIndex = i;
                        xOffset = this.x - Math.round(this.height / 2);
                        yOffset = this.y - this.width;
                        rowCount = this.width;
                        colCount = this.height;
                          				map[x][y + 1] = FLOOR;
                        				map[x ][y -1] = FLOOR;


                        break;
                    case 3:
                        xIndex = j;
                        yIndex = i;
                        xOffset = this.x - Math.round(this.height / 2);
                        yOffset = this.y;
                        rowCount = this.width;
                        colCount = this.height;
                        map[x][y + 1] = FLOOR;
                        				map[x ][y -1] = FLOOR;
                        break;
                }



                if (xIndex === 0 && yIndex === 0 || xIndex == colCount && yIndex == rowCount || xIndex === 0 && yIndex === rowCount || xIndex == colCount && yIndex === 0) {
                    tileType = CORNER;
                } else if (xIndex === 0 || yIndex === 0 || xIndex == colCount || yIndex == rowCount) {
                    tileType = WALL;
                } else {
                    tileType = FLOOR;
                }



                if (map[xIndex + xOffset][yIndex + yOffset] != CORNER) {
                    map[xIndex + xOffset][yIndex + yOffset] = tileType;
                }
            }
        }
        
        
		

    };
	// This function ensures that the area is clear to place a room, used for both rectangular and circle rooms
	// it's a near copy of the makeRoom function
    var checkArea = function(x, y, width, height, direction) {

		
        var xIndex = 0;
        var yIndex = 0;
        var xOffset = 0;
        var yOffset = 0;

        //  this.hallLength = hallLength;
        //this.hallWidth = 4;
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;
        this.direction = direction;
        
        

        for (i = 0; i <= this.width; i++) {
            for (j = 0; j <= this.height; j++) {

                switch (this.direction) { //set offset based on selected wall direction
                    case 0:

                        xIndex = i + 1;
                        yIndex = j;
                        xOffset = this.x;
                        yOffset = this.y - Math.round(this.height / 2);


                        break;
                    case 1:
                        xIndex = i - 1;
                        yIndex = j;
                        xOffset = this.x - this.width;
                        yOffset = this.y - Math.round(this.height / 2);

                        break;
                    case 2:
                        xIndex = j;
                        yIndex = i - 1;
                        xOffset = this.x - Math.round(this.height / 2);
                        yOffset = this.y - this.width;


                        break;
                    case 3:
                        xIndex = j;
                        yIndex = i + 1;
                        xOffset = this.x - Math.round(this.height / 2);
                        yOffset = this.y;

                        break;
                }

                if (xIndex + xOffset > map.length - 10 || xIndex + xOffset < 10 || yIndex + yOffset > map[0].length - 10 || yIndex + yOffset < 10) {
                    return false;
                }
                if (map[xIndex + xOffset][yIndex + yOffset] != EARTH) {
	            	return false;
                }


            }
        }
        return true;

    };


	
	
	var makeCircleRoom = function(x,y,radius,direction){
		this.width = radius * 2;
		this.height = radius * 2; 
		var xOffset = 0;
		var yOffset = 0;
		//Switch to correct positioning using an x/y offset based on direction (of selected wall)
		switch(direction){
			case 0:
				xOffset = radius-1;
				yOffset = 0;
				break;
			case 1:
				xOffset = -radius+1;
				yOffset = 0;
				break;
			case 2:
				xOffset = 0;
				yOffset = -radius+1;
				break;
			case 3:
				xOffset = 0;
				yOffset = radius-1;
				break;
		}
		
		
		makeCircle(x+xOffset,y+yOffset,radius,WALL);
	
	}
	
	
	
	
	makeCircleRoom(centerX,centerY,8,0);
	

	

    while (featureCount < maxFeatures) { 
        wallCoords = findWall();

        wallSide = checkSide(wallCoords[0], wallCoords[1]);


        switch (pickFeature()) {

            case 0: //room
                randomWidth = getRandomInt(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH); //get a random width and height within MIN and MAX restrictions		
                randomHeight = getRandomInt(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT); //get a random width and height within MIN and MAX restrictions
                if (checkArea(wallCoords[0], wallCoords[1], randomWidth, randomHeight, wallSide) === true) {
                    makeRoom(wallCoords[0], wallCoords[1], randomWidth, randomHeight, wallSide);
                    map[wallCoords[0]][wallCoords[1]] = DOOR;
                    featureCount++;
                }
                break;
            case 1: //hallway

                randomLength = getRandomInt(MIN_HALL_LENGTH, MAX_HALL_LENGTH);
                if (checkArea(wallCoords[0], wallCoords[1], randomLength, 4, wallSide) === true) {
                    makeRoom(wallCoords[0], wallCoords[1], randomLength, 4, wallSide);
                    map[wallCoords[0]][wallCoords[1]] = DOOR;
                    featureCount++;
                }
                break;
                
            case 2: //circle rooms WIP...

                randomLength = getRandomInt(MIN_HALL_LENGTH, MAX_HALL_LENGTH);

                if (checkArea(wallCoords[0], wallCoords[1], randomLength*2,randomLength*2,wallSide) === true) {
                    makeCircleRoom(wallCoords[0],wallCoords[1],randomLength,wallSide);
                    
                    featureCount++;
                    map[wallCoords[0]][wallCoords[1]] = DOOR;
                }
                
                break;
        }
    }
    



    this.map = map;

};










