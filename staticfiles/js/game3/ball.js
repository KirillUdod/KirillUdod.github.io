pc.script.attribute("gravity", "number", -9.8, {description: "The value of gravity to use"});
pc.script.attribute("defaultTap", "number", 5, {description: "Speed to set the ball to when it is tapped"});
pc.script.attribute("impactEffect", "entity", null, {description: "The particle effect to trigger when the ball is tapped"});
pc.script.attribute("ballMinimum", "number", -6, {description: "When ball reaches ball goes below minumum y value game over is triggered"});
pc.script.attribute("speedMult", "number", 4, {description: "Multiplier to apply to X speed when tap is off center"});
pc.script.attribute("angMult", "number", -6, {description: "Multiplier to apply to angular speed when tap is off center"});

pc.script.create('ball', function (app) {    
    var tmp = new pc.Vec3();
    
    // Creates a new Ball instance
    var Ball = function (entity) {
        this.entity = entity;

    };

    Ball.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.paused = true;
    
            // Get the "Game" Entity and start listening for events
            this.game = app.root.findByName("Game");
            
            app.on("game:start", this.unpause, this);
            app.on("game:gameover", this.pause, this);
            app.on("game:reset", this.reset, this);
            
            // Initialize properties
            this._vel = new pc.Vec3(0, 0, 0);
            this._acc = new pc.Vec3(0, this.gravity, 0);
            this._angSpeed = 0;
            
            // Store the initial position and rotation for reseting
            this._origin = this.entity.getLocalPosition().clone();
            this._rotation = this.entity.getLocalRotation().clone();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {            
            // Don't update when paused
            if (this.paused) {
                this.entity.rotate(0, 30*dt, 0);
                return;
            }
            
            var p = this.entity.getLocalPosition();
            
            // integrate the velocity in a temporary variable
            tmp.copy(this._acc).scale(dt);
            this._vel.add(tmp);
            
            // integrate the position in a temporary variable
            tmp.copy(this._vel).scale(dt);
            p.add(tmp);
            
            // update position
            this.entity.setLocalPosition(p);
            
            // rotate by angular speed
            this.entity.rotate(0, 0, this._angSpeed);
               
            // check for game over condition
            if (p.y < this.ballMinimum) {
                this.game.script.game.gameOver();
            }
        },
        
        /*
         * Called by the input handler to tap the ball up in the air
         * dx is the tap distance from centre of ball in x
         * dy is the tap distance from centre of ball in y
         */
        tap: function (dx, dy) { 
            // Update velocity and spin based on position of tap
            this._vel.set(this.speedMult * dx, this.defaultTap, 0);
            this._angSpeed += this.angMult * dx;
    
            // calculate the position of the tap in world space
            tmp.copy(this.entity.getLocalPosition());
            tmp.x -= dx;
            tmp.y -= dy;
            
            // trigger particle effect to tap position, facing away from the center of the ball
            this.impactEffect.setLocalPosition(tmp);
            this.impactEffect.particlesystem.reset();
            this.impactEffect.particlesystem.play();
            this.impactEffect.lookAt(this.entity.getPosition());
                
            // play audio
            this.entity.sound.play("bounce");
            
            // increment the score by 1
            this.game.script.game.addScore(1);
        },
        
        // Pause the ball update when not playing the game
        unpause: function () {
            this.paused = false;
            
            // start game with a tap
            this.tap(0, 0);
        },
        
        // Resume ball updating
        pause: function () {
            this.paused = true;
        },
        
        // Reset the ball to initial values
        reset: function () {
            this.entity.setLocalPosition(this._origin);
            this.entity.setLocalRotation(this._rotation);
            this._vel.set(0,0,0);
            this._acc.set(0, this.gravity, 0);
            this._angSpeed = 0;
        }
    };

    return Ball;
});