var enemy = function(parent) {
    'use strict';

    function getNextDirection(current) {
        switch (current) {
            case 'up':
                return 'right';
            case 'right':
                return 'down';
            case 'down':
                return 'left';
            case 'left':
                return 'up';
            default:
                throw new Error('Invalid direction!');
        }
    }

    let directions = {
        'left': {
            x: -1,
            y: 0
        },
        'down': {
            x: 0,
            y: 1
        },
        'up': {
            x: 0,
            y: -1
        },
        'right': {
            x: 1,
            y: 0
        }
    };
    let enemy = Object.create(parent);

    Object.defineProperty(enemy, 'move', {
        value: function(validateMoveCallback) {
            let nextX = this.x + (directions[this.movingDirection].x * this.speed);
            let nextY = this.y + (directions[this.movingDirection].y * this.speed);
            let isValidMove = validateMoveCallback({
                x: nextX,
                y: nextY,
                width: this.width,
                height: this.height
            });

            // let dirs = ['left', 'right', 'up', 'down'];
            // let dir = this.movingDirection;
            // while (dir === this.movingDirection) {
            //     let randomDirection = Math.random() * 4 | 0;
            //     dir = dirs[randomDirection];
            // }

            // let isValidMove2 = validateMoveCallback({
            //     x: this.x + (directions[dir].x * this.speed),
            //     y: this.y + (directions[dir].y * this.speed),
            //     width: this.width,
            //     height: this.height
            // });

            // if (isValidMove2) {
            //     this.x = nextX;
            //     this.y = nextY;
            //     this.sprite.changeAnimation(this.movingDirection);
            //     this.sprite.changePosition(this.x, this.y);
            //     return;
            // }

            if (isValidMove) {
                this.x = nextX;
                this.y = nextY;
                this.sprite.changeAnimation(this.movingDirection);
                this.sprite.changePosition(this.x, this.y);
            } else {
                let current = this.movingDirection;
                while (true) {
                    let nextDirection = getNextDirection(current);
                    nextX = this.x + (directions[nextDirection].x * this.speed);
                    nextY = this.y + (directions[nextDirection].y * this.speed);
                    isValidMove = validateMoveCallback({
                        x: nextX,
                        y: nextY,
                        width: this.width,
                        height: this.height
                    });
                    if (isValidMove) {
                        this.x = nextX;
                        this.y = nextY;
                        this.movingDirection = nextDirection;
                        this.sprite.changeAnimation(this.movingDirection);
                        this.sprite.changePosition(this.x, this.y);
                        break;
                    }

                    current = nextDirection;
                }
            }
        }
    });

    return enemy;
}(tank);