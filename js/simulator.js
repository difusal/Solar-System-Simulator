// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var yCorrection = -5;
var aspect_ratio = window.innerWidth / (window.innerHeight+yCorrection);

var aboveCam = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 1e6);
aboveCam.position.z = 1000;
scene.add(aboveCam);

var earthCam = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 1e6);
scene.add(earthCam);

var marsCam = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 1e6);
scene.add(marsCam);

var camera = aboveCam;

// This will draw what the camera sees onto the screen:
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight+yCorrection);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

// ******** START CODING ON THE NEXT LINE ********
document.body.style.backgroundColor = 'black';

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

var surface = new THREE.MeshPhongMaterial({ambient: 0xFFD700});
var star = new THREE.SphereGeometry(100, 28, 21);
var sun = new THREE.Mesh(star, surface);
scene.add(sun);

var sunlight = new THREE.PointLight(0xffffff, 5, 1000);
sun.add(sunlight);

var surface = new THREE.MeshPhongMaterial({ambient: 0x1a1a1a, color: 0x0000cd});
var planet = new THREE.SphereGeometry(20, 20, 35);
var earth = new THREE.Mesh(planet, surface);
earth.position.set(250, 0, 0);
scene.add(earth);

var surface = new THREE.MeshPhongMaterial({ambient: 0x1a1a1a, color: 0xffffff});
var satellite = new THREE.SphereGeometry(15, 30, 25);
var moon = new THREE.Mesh(satellite, surface);

var moon_orbit = new THREE.Object3D();
earth.add(moon_orbit);
moon_orbit.add(moon);
moon.position.set(0, 100, 0);
moon_orbit.add(earthCam);
earthCam.rotation.set(Math.PI/2, 0, 0);

var surface = new THREE.MeshPhongMaterial({ambient: 0x1a1a1a, color: 0xb22222});
var planet = new THREE.SphereGeometry(20, 20, 15);
var mars = new THREE.Mesh(planet, surface);
mars.position.set(500, 0, 0);
scene.add(mars);

var stars = new THREE.Geometry();
while (stars.vertices.length < 1e4) {
	var lat = Math.PI * Math.random() - Math.PI/2;
	var lon = 2*Math.PI * Math.random();

	stars.vertices.push(new THREE.Vector3(
		1e5 * Math.cos(lon) * Math.cos(lat),
		1e5 * Math.sin(lon) * Math.cos(lat),
		1e5 * Math.sin(lat)
		));
}
var star_stuff = new THREE.ParticleBasicMaterial({size: 500});
var star_system = new THREE.ParticleSystem(stars, star_stuff);
scene.add(star_system);

// Now, show what the camera sees on the screen:
var time = 0,
speed = 1,
pause = false;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	if (pause)
		return;

	time += speed;

	var e_angle = time * 0.001;
	earth.position.set(250* Math.cos(e_angle), 250* Math.sin(e_angle), 0);

	var moon_angle = time * 0.02;
	moon_orbit.rotation.set(0, 0, moon_angle);

	var m_angle = time * 0.0015;
	mars.position.set(500* Math.cos(m_angle), 500* Math.sin(m_angle), 0);

	var y_diff = mars.position.y - earth.position.y;
	var x_diff = mars.position.x - earth.position.x;
	var angle = Math.atan2(x_diff, y_diff);

	marsCam.rotation.set(Math.PI/2, -angle, 0);
	marsCam.position.set(earth.position.x, earth.position.y, 22);
}
animate();

document.addEventListener("keydown", function(event) {
	var code = event.keyCode;

    // Above - A
    if (code == 65)
    	camera = aboveCam;
    // Mars - M
    if (code == 77)
    	camera = marsCam;
    // Earth - E
    if (code == 69)
    	camera = earthCam;
    
    // pause/resume - P
    if (code == 80)
    	pause = !pause;
    
    // different speeds - 1, 2, 3
    if (code == 49)
    	speed = 1;
    if (code == 50)
    	speed = 2;
    if (code == 51)
    	speed = 3;
});