pc.script.create('ui_score', function (app) {
    // Creates a new Ui_score instance
    var Ui_score = function (entity) {
        this.entity = entity;
    };

    Ui_score.prototype = {
        initialize: function () {
            this.score = this.entity.findByName("Score");
        },
    
        onEnable: function () {
            // listen for score events on the game object and update the score
            app.on("game:score", this._changeScore, this);
            this._changeScore(0);
        },
        
        onDisable: function () {
            // stop listening for events
            app.off("game:score", this._changeScore, this);
        },
        
        _changeScore: function (newScore) {
            // Update the text
            this.score.script.font_renderer.text = newScore.toString();
        }
    };

    return Ui_score;
});