import settings as s
import cv2
import numpy as np

def match(left, right) :
	leftKp, leftDes = doSurf(left)
	rightKp, rightDes = doSurf(right)
	
	bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=True)

	matches = bf.match(leftDes,rightDes)

	img3 = drawMatches(left,leftKp,right,rightKp,matches)

	if s.DISPLAY() :
		leftKpImg = cv2.drawKeypoints(left,leftKp,None,(255,0,0),4)
		rightKpImg = cv2.drawKeypoints(right,rightKp,None,(255,0,0),4)
		cv2.imshow('Matches',img3)


	# if s.DISPLAY() :
    #     cv2.imshow('Left',left)
    #     cv2.imshow('Right',right)
    #     if cv2.waitKey(0) & 0xFF == ord('q'):
    #         break

def doSurf(img) :
	surf = cv2.SURF(10000)
	print surf.descriptorSize()
	print surf.extended
	kp, des = surf.detectAndCompute(img,None)
	print len(kp)
	return kp, des

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