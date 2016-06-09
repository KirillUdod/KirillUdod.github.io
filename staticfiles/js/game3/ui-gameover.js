pc.script.create('ui_gameover', function (app) {
    // Creates a new Ui_gameover instance
    var Ui_gameover = function (entity) {
        this.entity = entity;
    };

    Ui_gameover.prototype = {
        initialize: function () {
            this.score = this.entity.findByName("Score");
            this._score = 0;
            
            app.on("game:score", function (score) {
                this._score = score;
            }, this);

            this.onEnable();
        },

        onEnable: function () {
            // Listen for any event to move on from this page
            app.mouse.on("mouseup", this.reset, this);
            if (app.touch) {
                app.touch.on("touchend", this.reset, this);                
            }
    
            this.score.script.font_renderer.text = this._score.toString();
        },
        
        onDisable: function () {
            // Stop listening to events
            app.mouse.off("mouseup", this.reset, this);
            if (app.touch) {
                app.touch.off("touchend", this.reset, this);                
            }
        },
        
        reset: function (e) {
            app.fire("ui:reset");
            
            // prevent touch and mouse events
            e.event.preventDefault();
        }
    };

    return Ui_gameover;
});