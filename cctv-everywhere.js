(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.cctv = factory();
    }
}(this, function() {

    function cctv() {

        var extend = function(dest, src) {
            for (var prop in src) {
                dest[prop] = src[prop];
            }
            return dest;
        };

        var cctvCam = {
            viewPoint: {
                x: 0,
                y: 0
            },
            angle: 0,
            newAngle: 0,
            translation: {
                x: 62.5,
                y: 92
            },
            maxAngle: 2.85,
            minAngle: -0.55,

            init: function(options) {
                this.size = options.size || 200;
                this.color = options.color || '#303030';
            },
            draw: function() {
                // smooth movement of the cam. Thanks Andy!
                this.angle += (this.newAngle - this.angle) / 15;
                ctx.beginPath();
                // draw horizontal stab
                ctx.rect(0, 70, 10, 45);
                this.roundRect(9, 83.75, 10, 17.5, 2);
                ctx.rect(18.5, 90, 37, 5);
                // draw joint
                ctx.arc(this.translation.x, this.translation.y, 7.5, 0, 2 * Math.PI);
                ctx.save();
                // translate to center of the joint
                ctx.translate(this.translation.x, this.translation.y);
                ctx.rotate(this.angle);
                // draw vertical stab
                ctx.rect(-2.5, -32.5, 5, 32.5);
                this.roundRect(-8.5, -37.5, 17.5, 6, 2);
                // draw cam
                ctx.rect(-32, -64, 80, 27.5);
                ctx.rect(48, -60, 5, 15);
                ctx.rect(52, -57.25, 4, 10);
                // restore initial state of canvas
                ctx.restore();
                ctx.fillStyle = this.color;
                ctx.fill();
            },
            update: function(_angle) {
                if (_angle < this.minAngle) {
                    _angle = this.minAngle;
                }
                if (_angle > this.maxAngle) {
                    _angle = this.maxAngle;
                }
                this.newAngle = _angle;
                // calculate absolute pos of the cam
                this.viewPoint.x = this.translation.x - (50 * Math.cos(this.angle + (90 * Math.PI / 180)));
                this.viewPoint.y = (this.translation.y + parseInt(options.top)) - (50 * Math.sin(this.angle + (90 * Math.PI / 180)));
            },
            roundRect: function(x, y, width, height, radius) {
                var r = x + width;
                var b = y + height;
                ctx.moveTo(x + radius, y);
                ctx.lineTo(r - radius, y);
                ctx.quadraticCurveTo(r, y, r, y + radius);
                ctx.lineTo(r, y + height - radius);
                ctx.quadraticCurveTo(r, b, r - radius, b);
                ctx.lineTo(x + radius, b);
                ctx.quadraticCurveTo(x, b, x, b - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
            }
        };

        var ctx,
            width,
            height,
            mouse = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            },
            options = {
                color: '#333',
                top: '75px',
                size: 200
            };

        function init(opts) {
            if (!window.HTMLCanvasElement) return false;

            options = extend(options, opts);
            createCanvas(options);
            cctvCam.init(options);
            bindEventHandlers();
            draw();
        }

        function createCanvas(options) {
            var canvas = document.createElement('canvas');
            var pixelSize = window.devicePixelRatio || 1;

            canvas.id = 'cctv-cam';
            canvas.style.position = 'absolute';
            canvas.style.top = options.top || 0;
            canvas.style.right = options.side === 'right' ? 0 : 'auto';
            canvas.style.width = canvas.style.height = (options.size || 200)+'px';
            canvas.width = width = canvas.height = height = (options.size || 200)*pixelSize;

            ctx = canvas.getContext('2d');

            if (options.side === 'right') {
                ctx.translate(width, 0);
                ctx.scale(-pixelSize, pixelSize);
            }else {
                ctx.scale(pixelSize,pixelSize);
            }

            document.body.appendChild(canvas);
        }

        function bindEventHandlers() {
            document.onmousemove = function(e) {
                mouse.x = e.pageX || e.clientX;
                mouse.y = e.pageY || e.clientY;
            };
        }

        function update() {
            var deltaX = mouse.x - cctvCam.translation.x,
                deltaY = mouse.y - (cctvCam.translation.y + parseInt(options.top)),
                // distance between mouse and joint of the camPoint
                mag = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // only update cam if the distance of the mouse is > 50
            if (mag > 50 && mouse.x > 20) {
                calculateAngle();
            }
        }

        function calculateAngle() {
            var camPoint = cctvCam.viewPoint,
                // calculate angle between cam and mouse
                deltaY = mouse.y - camPoint.y,
                deltaX = options.side === 'right' ? Math.abs(mouse.x - (window.innerWidth - camPoint.x)) : mouse.x - camPoint.x;

            var angleRad = Math.atan2(deltaY, deltaX);
            cctvCam.update(angleRad);
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            update();
            cctvCam.draw();
            requestAnimationFrame(draw);
        }

        return {
            watch: init
        }

    }

    return cctv();

}));