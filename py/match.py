import display as d
import cv2
import numpy as np
import math

def match(left, right) :
    leftKp, leftDes = doSurf(left)
    rightKp, rightDes = doSurf(right)
    
    bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=True)

    matches = bf.match(leftDes,rightDes)

    disps = disparity(left,leftKp,right,rightKp,matches)
    disps = filterDisparities(disps)
    
    # for d in disps:
    #     print 'dx: %.2f dy: %.2f d: %.2f matchDistance: %.2f' % (
    #         d['dx'],d['dy'],d['disp'],d['match'].distance)

    minDisp, maxDisp = minMaxDisp(disps)

    matchDict = {'left':left,'leftKp':leftKp,'leftDes':leftDes,
        'right':right,'rightKp':rightKp,'rightDes':rightDes,
        'matchDisparities':disps,'minDisparity':minDisp,'maxDisparity':maxDisp};
    
    return matchDict

def filterDisparities(disparities):
    disparities = filter(lambda x: x['disp'] > 100, disparities)
    disparities = filter(lambda disp: disp['disp'] < 180, disparities)
    disparities = filter(lambda disp: abs(disp['dy']) < 1, disparities)
    disparities = filter(lambda disp: abs(disp['dy']) > -1, disparities)
    return disparities

def doSurf(img) :
    surf = cv2.SURF(1000)
    kp, des = surf.detectAndCompute(img,None)
    return kp, des

def minMaxDisp(disparities) :
    if len(disparities) > 0:
        minDisp = min(disparities, key = lambda d : math.fabs(d['disp']))
        maxDisp = max(disparities, key = lambda d : math.fabs(d['disp']))
        return minDisp, maxDisp
    return None, None

def disparity(img1, kp1, img2, kp2, matches):

    out = [0] * len(matches)

    # For each pair of points we have between both images
    # calculate the disparity
    for i, mat in enumerate(matches):

        # Get the matching keypoints for each of the images
        img1_idx = mat.queryIdx
        img2_idx = mat.trainIdx

        # x - columns
        # y - rows
        (x1,y1) = kp1[img1_idx].pt
        (x2,y2) = kp2[img2_idx].pt

        dx = x1-x2
        dy = y1-y2
        d = math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
        out[i] = {'disp': d, 'dx' : dx, 'dy': dy, 'match': mat}

    return out