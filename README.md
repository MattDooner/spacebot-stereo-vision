# spacebot-stereo-vision

This project was created for the 2015 International Space Apps Challenge. Our team was based in Glasgow, UK and consisted of myself and Tom HP (https://github.com/halfpt).

The goal of the project is to create a data dashboard to better interpret and understand stereo matching data from the SPHERES robots used in the Zero Robotics competition.

The Challenge: https://2015.spaceappschallenge.org/challenge/spacebot-stereo-vision/

Our Project: https://2015.spaceappschallenge.org/project/stereo-vision-experiment-review-tool/

Live Demo: http://spaceapps-challenge.s3-website-us-west-2.amazonaws.com

Presentation: https://docs.google.com/presentation/d/1FTNnmAVnhetua1DRyueXd7kgqWQzpRBgIp0VXDmVd0U/edit?usp=sharing

One complication with this challenge was the lack of data available from the SPHERES robots or Zero Robotics competitions. To get matching results, we used OpenCV to apply the SURF and brute-force matching algorithms to videos published on YouTube (https://www.youtube.com/user/MITSpaceSystemsLab/videos).

# Building and Running

## `py/` OpenCV / Python Feature Matching

You'll first need to install Python and OpenCV with Python bindings. Please have a look at http://www.opencv.org for details as steps vary depending on your enviornment.
This project was run on OpenCV 2.4.10, Python 2.7.3, and Debian 6.

```
cd py/
python main.py
```

## `stereoSurfApp/` Web Application / Data Dashboard

The web app uses the Ionic (http://ionicframework.com/) web framework along with node, npm, and bower. You'll need to first install node.js (https://nodejs.org/)

```
cd stereoSurfApp/
npm install -g gulp
npm install -g bower
npm install -g ionic
bower install
ionic setup sass
ionic serve
```
# Credits

## iOS Icon resources

Starry background: http://zummerfish.deviantart.com/art/Starry-textures-193667479
Metal texture: http://www.psdgraphics.com/textures/dirty-metal-surface-texture/
Space station vector: Icon made by Freepik from www.flaticon.com



