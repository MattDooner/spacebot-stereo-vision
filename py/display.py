import utils
import cv2
import numpy as np

def DISPLAY():
	return False

def displayDisparity(matchDict):
	if DISPLAY() :
		img3 = drawDisparity(matchDict)
		cv2.imshow('Disparity',img3)

def displayKeypoints(matchDict):
	if s.DISPLAY() :
		m = utils.Bunch(matchDict)
		leftKpImg = cv2.drawKeypoints(m.left,m.leftKp,None,(255,0,0),4)
		rightKpImg = cv2.drawKeypoints(m.right,m.rightKp,None,(255,0,0),4)
		img3 = arragePairs(leftKpImg,rightKpImg)
		cv2.imshow('Keypoints',img3)

def arrangePairs(img1, img2):
    # Create a new output image that concatenates the two images together
    # (a.k.a) a montage
    rows1 = img1.shape[0]
    cols1 = img1.shape[1]
    rows2 = img2.shape[0]
    cols2 = img2.shape[1]

    out = np.zeros((max([rows1,rows2]),cols1+cols2,3), dtype='uint8')

    # Place the first image to the left
    out[:rows1,:cols1,:] = np.dstack([img1, img1, img1])

    # Place the next image to the right of it
    out[:rows2,cols1:cols1+cols2,:] = np.dstack([img2, img2, img2])

    return out

def drawDisparity(matchDict):

    m = utils.Bunch(matchDict)

    out = arrangePairs(m.left, m.right)
    cols1 = m.left.shape[1]

    if len(m.matchDisparities) == 0:
    	return out

    colormap = ColorMap((0,255,0),(0,0,255),m.minDisparity['disp'],m.maxDisparity['disp'])

    # For each pair of points we have between both images
    # draw circles, then connect a line between them
    for matchDisparity in m.matchDisparities:

    	mat = matchDisparity['match']
    	d = matchDisparity['disp']
    	dx = matchDisparity['dx']
    	dy = matchDisparity['dy']

        # Get the matching keypoints for each of the images
        img1_idx = mat.queryIdx
        img2_idx = mat.trainIdx

        # x - columns
        # y - rows
        (x1,y1) = m.leftKp[img1_idx].pt
        (x2,y2) = m.rightKp[img2_idx].pt

        # Draw a small circle at both co-ordinates
        # radius 4
        # colour blue
        # thickness = 1
        # print 'd: %.2f dx: %.2f dy: %.2f' % (d,dx,dy)
        color = colormap[d]
        cv2.putText(out, str(round(dx)), (int(x1),int(y1)), cv2.FONT_HERSHEY_PLAIN, 1, color)
        #cv2.circle(out, (int(x1),int(y1)), 4, color, 1)   
        cv2.circle(out, (int(x2)+cols1,int(y2)), 4, color, 1)

        # Draw a line in between the two points
        # thickness = 1
        # colour blue
        cv2.line(out, (int(x1),int(y1)), (int(x2)+cols1,int(y2)), color, 1)

    return out

def drawMatches(img1, kp1, img2, kp2, matches):
    """
    My own implementation of cv2.drawMatches as OpenCV 2.4.9
    does not have this function available but it's supported in
    OpenCV 3.0.0

    This function takes in two images with their associated 
    keypoints, as well as a list of DMatch data structure (matches) 
    that contains which keypoints matched in which images.

    An image will be produced where a montage is shown with
    the first image followed by the second image beside it.

    Keypoints are delineated with circles, while lines are connected
    between matching keypoints.

    img1,img2 - Grayscale images
    kp1,kp2 - Detected list of keypoints through any of the OpenCV keypoint 
              detection algorithms
    matches - A list of matches of corresponding keypoints through any
              OpenCV keypoint matching algorithm
    """

    out = arrangePairs(img1, img2)

    # For each pair of points we have between both images
    # draw circles, then connect a line between them
    for mat in matches:

        # Get the matching keypoints for each of the images
        img1_idx = mat.queryIdx
        img2_idx = mat.trainIdx

        # x - columns
        # y - rows
        (x1,y1) = kp1[img1_idx].pt
        (x2,y2) = kp2[img2_idx].pt

        # Draw a small circle at both co-ordinates
        # radius 4
        # colour blue
        # thickness = 1
        cv2.circle(out, (int(x1),int(y1)), 4, (255, 0, 0), 1)   
        cv2.circle(out, (int(x2)+cols1,int(y2)), 4, (255, 0, 0), 1)

        # Draw a line in between the two points
        # thickness = 1
        # colour blue
        cv2.line(out, (int(x1),int(y1)), (int(x2)+cols1,int(y2)), (255, 0, 0), 1)

    return out

class ColorMap:
    startcolor = ()
    endcolor = ()
    startmap = 0
    endmap = 0
    colordistance = 0
    valuerange = 0
    ratios = []    

    def __init__(self, startcolor, endcolor, startmap, endmap):
        self.startcolor = np.array(startcolor)
        self.endcolor = np.array(endcolor)
        self.startmap = float(startmap)
        self.endmap = float(endmap)
        if abs(self.startmap - self.endmap) < 0.00001:
            self.endmap = self.endmap + 1
        self.valuerange = float(self.endmap - self.startmap)
        self.ratios = (self.endcolor - self.startcolor) / self.valuerange

    def __getitem__(self, value):
        color = tuple(self.startcolor + (self.ratios * (value - self.startmap)))
        return (int(color[0]), int(color[1]), int(color[2]))