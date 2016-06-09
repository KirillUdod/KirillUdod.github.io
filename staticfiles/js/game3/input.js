pc.script.attribute("ball", "entity", null);
pc.script.attribute("camera", "entity", null);
pc.script.attribute("ballRadius", "number", 0.5);

pc.script.create('input', function (app) {
    var PIXEL_SIZE = 30;
    
    var screenPos = new pc.Vec3();
    var worldPos = new pc.Vec3();
    
    // Creates a new Input instance
    var Input = function (entity) {
        this.entity = entity;
        this._paused = true;
    };

    Input.prototype = {
        initialize: function () {
            var self = this;
    
            // Listen for game events so we know whether to respond to input
            app.on("game:start", function () {
                self._paused = false;
            });
            app.on("game:gameover", function () {
                self._paused = true;
            });
            
            // set up touch events if available
            if(app.touch) {
                app.touch.on("touchstart", this._onTouchStart, this);                
            }
            
            // set up mouse events
            app.mouse.on("mousedown", this._onMouseDown, this);
        },
        
        _onTap: function (x, y) {
            var p = this.ball.getPosition();
            var camPos = this.camera.getPosition();
    
            // Get the position in the 3D world of the touch or click
            // Store the in worldPos variable. 
            // This position is at the same distance away from the camera as the ball
            this.camera.camera.screenToWorld(x, y, camPos.z - p.z, worldPos);
                        
            // get the distance of the touch/click to the ball
            var dx = (p.x - worldPos.x);
            var dy = (p.y - worldPos.y);
    
            // If the click is inside the ball, tap the ball
            var lenSqr = dx*dx + dy*dy;
            if (lenSqr < this.ballRadius*this.ballRadius) {
                this.ball.script.ball.tap(dx, dy);
            }            
        },
        
        _onTouchStart: function (e) {
            if (this._paused) {
                return;
            }
            
            // respond to event
            var touch = e.changedTouches[0];
            this._onTap(touch.x, touch.y);
            
            // stop mouse events firing as well
            e.event.preventDefault();
        },
        
        _onMouseDown: function (e) {
            if (this._paused) {
                return;
            }
    
            // respond to event
            this._onTap(e.x, e.y);
        }
    };

    return Input;
});