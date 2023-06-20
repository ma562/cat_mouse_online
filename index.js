const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const VELOCITY = 3;

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Boundary {
	static width = 40
	static height = 40
	constructor({ position }) {
		this.position = position
		this.width = 40
		this.height = 40
	}

	draw() {
		//c.drawImage(this.image, this.position.x, this.position.y)
		c.fillStyle = 'green'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

class Player {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		this.image = new Image();
    	this.image.src = 'mouse3.png';
    	this.radius = 18; // Adjust the radius of the player image
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

	update() {
		this.draw()
		//no going horizontal
		if(this.velocity.x != 0) {
			this.position.x += this.velocity.x 
		}
		else {
			this.position.y += this.velocity.y
		}
		
	}

}

class Cat {
	constructor({ position, velocity }) {
		this.position = position
		this.velocity = velocity
		// this.radius = 15
		this.image = new Image();
    	this.image.src = 'cat3.png';
    	this.radius = 15; // Adjust the radius of the player image
	}


	draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'transparent';
    c.fill();
    c.closePath();

    // const imageRadius = this.radius * Math.sqrt(2);
    const imageRadius = this.radius;
    c.drawImage(
      this.image,
      this.position.x - imageRadius,
      this.position.y - imageRadius,
      imageRadius * 2,
      imageRadius * 2
    );

  }

	update() {
		this.draw()
		this.position.x += this.velocity.x 
		this.position.y += this.velocity.y

		
	}

}

const boundaries = []

const keys = {
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

let lastKey = ''

const map = [['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', '-', ' ', ' ','-', ' ', ' ', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', '-', '-', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ','-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', '-', '-', '-','-', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', ' ',' ', ' ', '-', ' ', ' ', '-', '-', '-', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', ' ', '-', ' ', ' ', '-','-', ' ', '-', ' ', ' ', '-', '-', ' ', '-'],
			 ['-', ' ', ' ', ' ', ' ', ' ',' ', ' ', '-', ' ', ' ', ' ', ' ', ' ', '-'],
			 ['-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-', '-', '-', '-']
			]


const mapWidth = map[0].length * Boundary.width;
const mapHeight = map.length * Boundary.height;



// Calculate offsets to center the map
const offsetX = Math.floor((canvas.width - mapWidth) / 2);
const offsetY = Math.floor((canvas.height - mapHeight) / 2);

const cat = new Cat({
	position: {
		x: offsetX + Boundary.width + Boundary.width / 2,
		y: offsetY + Boundary.width + Boundary.width / 2
	},
	velocity: {
		x: 0,
		y: 0
	}
})

const player = new Player({
	position: {
		// x: offsetX + Boundary.width + Boundary.width / 2,
		// y: offsetY + Boundary.width + Boundary.width / 2
		x: offsetX + Boundary.width + Boundary.width / 2,
		y: offsetY + Boundary.width + Boundary.width / 2
	 },
	 velocity: {
	 	x:0,
	 	y:0
	 }
})

map.forEach((row, i) => {
	row.forEach((symbol, j) => {
		switch (symbol) {
			case '-':
			boundaries.push(
				new Boundary({
					position: {
						// x: Boundary.width * j,
						// y: Boundary.height * i
						 x: offsetX + Boundary.width * j,
              		     y: offsetY + Boundary.height * i
					}
				})
			)
			// console.log(offsetX + Boundary.width * j)
			// console.log(Boundary.width)
			break
		}
	})
})

function circleCollidesWithRectangle({
	circle,
	rectangle
}) {
	return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height 
			&& circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x 
			&& circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
			&& circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width)
}

function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)

	if (keys.w.pressed && lastKey === 'w') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: 0,
					y: -VELOCITY
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = -VELOCITY
		}
		}
	}
	else if (keys.a.pressed && lastKey === 'a') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: -VELOCITY,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = -VELOCITY
			player.velocity.y = 0
		}
		}
	}
	else if (keys.s.pressed && lastKey === 's') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: 0,
					y: VELOCITY
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.y = 0
			break
		} else {
			player.velocity.x = 0
			player.velocity.y = VELOCITY
		}
		}
	}
	else if (keys.d.pressed && lastKey === 'd') {
		for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if (circleCollidesWithRectangle({
			circle: {
				...player, 
				velocity: {
					x: VELOCITY,
					y: 0
				}
			},
			rectangle: boundary
			})
		) {
			player.velocity.x = 0
			break
		} else {
			player.velocity.x = VELOCITY
			player.velocity.y = 0
		}
		}
	}

	boundaries.forEach((boundary) => {
		boundary.draw()
		if (circleCollidesWithRectangle({
			circle: player,
			rectangle: boundary
		})) {
			console.log('we are colliding')
			player.velocity.x = 0
			player.velocity.y = 0
		}

	})

	player.update()
	cat.update()
	// console.log(player.position);
	// console.log(player.position)
	// player.velocity.y = 0
	// player.velocity.x = 0
}

animate()

window.addEventListener('keydown', ({key}) => {
	switch (key) {
		case 'w':
			keys.w.pressed = true
			lastKey = 'w'
			break
		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			break
		case 's':
			keys.s.pressed = true
			lastKey = 's'
			break
		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			break
	}
})

window.addEventListener('keyup', ({key}) => {
	switch (key) {
		case 'w':
			keys.w.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 's':
			keys.s.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
	}
})









