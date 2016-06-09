pc.script.attribute("uiMenu", "entity", null);
pc.script.attribute("uiInGame", "entity", null);
pc.script.attribute("uiGameOver", "entity", null);
pc.script.attribute("audio", "entity", null);

pc.script.create('game', function (app) {
    var STATE_MENU = "menu";
    var STATE_INGAME = "ingame";
    var STATE_GAMEOVER = "gameover";
    
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        
        this._state = STATE_MENU;
    };

    Game.prototype = {
        initialize: function () {
            this._score = 0;
            
            this.setResolution();
            
            window.addEventListener("resize", this.setResolution.bind(this));
            
            // listen to events from the UI
            app.on("ui:start", this.start, this);
            app.on("ui:reset", this.reset, this);
        },

        update: function (dt) {   
        },
        
        setResolution: function () {
            // if the screen width is less than 640 
            // fill the whole window
            // otherwise
            // use the default setting

            var w = window.screen.width;
            var h = window.screen.height;
            
            if (w < 640) {
                app.setCanvasResolution(pc.RESOLUTION_AUTO, w, h);
                app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
            }
        },
        
        // Call this to move from MENU to INGAME
        start: function () {
            this._state = STATE_INGAME;
            app.fire("game:start");
            this.uiMenu.enabled = false;
            this.uiInGame.enabled = true;
            
            this.audio.sound.play("music");
        },
        
        // Call this to move from INGAME to GAMEOVER
        gameOver: function () {
            this._state = STATE_GAMEOVER;
            app.fire("game:gameover");
            this.uiInGame.enabled = false;
            this.uiGameOver.enabled = true;
            
            this.audio.sound.stop();
            this.audio.sound.play("gameover");
        },
        
        // Call this to move from GAMEOVER to MENU
        reset: function () {
            app.fire("game:reset");
            this.resetScore();
            this._state = STATE_MENU;
            this.uiGameOver.enabled = false;
            this.uiMenu.enabled = true;

            this.audio.sound.stop();
        },
       
        // return the current score
        getScore: function () {
            return this._score;
        },
            
        // add a value to the score
        addScore: function (v) {
            this._score += v;
            app.fire("game:score", this._score);
        },
        
        // reset the score
        resetScore: function () {
            this._score = 0;
            app.fire("game:score", this._score);
        }        
    };

    return Game;
});