## Overview

Try the following link: https://nrsharip.github.io/threejs-shmup/

This is a classical [Shoot 'em up](https://en.wikipedia.org/wiki/Shoot_%27em_up) to further sharpen the game development skills with [Three.js](https://threejs.org/) and [WebGL](https://en.wikipedia.org/wiki/WebGL). Following are the features currently implemented:

- Some form of a game design pattern emerged on top of [Three.js](https://threejs.org/)'s environment, including [pooling](https://en.wikipedia.org/wiki/Object_pool_pattern), game lifecycles, separate scripts (classes) handling each game object etc.
- Physics enabled with [Ammo.js](https://github.com/kripken/ammo.js/) mostly to track collisions (bullets vs crafts, player vs enemies)
- [Yuka](https://mugen87.github.io/yuka/) has been used to supply [Seek Steering Behavior](https://mugen87.github.io/yuka/examples/steering/seek/) (to calculate the rocket trajectories)

## Screenshots

<img src="docs/run.gif?raw=true" width="100%">

<table>
  <tr>
    <td><img src="docs/screenshot1.png?raw=true" width="100%"></td>
    <td><img src="docs/screenshot3.png?raw=true" width="100%"></td>
    <td><img src="docs/screenshot4.png?raw=true" width="100%"></td>
  </tr>
</table>

## Development

1. Download and unzip the [source archive](https://github.com/nrsharip/threejs-shmup/archive/refs/heads/main.zip) to *./work directory/*

   OR

   ```
   git clone https://github.com/nrsharip/threejs-shmup.git
   ```
1. Install [Python](https://www.python.org/)
1. From a command line CD into your *./work directory/* with the sources and run this from a command line ([see also](https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally)):
   ```
   //Python 2.x
   python -m SimpleHTTPServer
   ```
   OR
   ```
   //Python 3.x
   python -m http.server
   ```
1. Go to http://localhost:8000/
1. Use any editor of your choice ([VSCode](https://code.visualstudio.com/) for example)

### File Structure

<img src="docs/structure.png?raw=true" width="100%">

### Game Lifecycles

<img src="docs/flow.png?raw=true" width="100%">

### Object Pooling

<img src="docs/pooling.png?raw=true" width="100%">

## License

This project is available under the [MIT license](LICENSE) © Nail Sharipov