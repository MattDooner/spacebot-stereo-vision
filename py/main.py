import cv, cv2
import numpy as np
from matplotlib import pyplot as plt
import display as d
import match as m
import utils
import json

def formatMatchPoints(matchDict) :
    mps = matchDict['matchDisparities']
    out = [0] * len(mps)
    for i, mp in enumerate(mps):
        out[i] = formatMatchPoint(mp,matchDict)
    return out

def formatMatchPoint(mp, matchDict) :
    fmt = {};
    # print '### mp ###'
    # print mp
    x1,y1,x2,y2 = utils.extractPoints(matchDict, mp)
    fmt['leftKp'] = {'x':x1, 'y':y1}
    fmt['rightKp'] = {'x':x2, 'y':y2}
    fmt['matchDistance'] = mp['match'].distance
    return fmt

def matchPointStats(mpsFmt) :
    # print mpsFmt
    mpsStats = {}
    dists = [0] * len(mpsFmt)
    for i, mpFmt in enumerate(mpsFmt):
        dists[i] = mpFmt['matchDistance']
    if(len(dists) > 0):
        mpsStats['min'] = min(dists)
        mpsStats['max'] = max(dists)
        mpsStats['mean'] = np.mean(dists)
        mpsStats['stdev'] = np.std(dists)
    else:
        mpsStats['min'] = 0
        mpsStats['max'] = 0
        mpsStats['mean'] = 0
        mpsStats['stdev'] = 0
    return mpsStats

cap = cv2.VideoCapture('data/test4-slam.avi')
count = 0

total_frames = cap.get(cv.CV_CAP_PROP_FRAME_COUNT)
fps = cap.get(cv.CV_CAP_PROP_FPS)
frameWidth = cap.get(cv.CV_CAP_PROP_FRAME_WIDTH)
frameHeight = cap.get(cv.CV_CAP_PROP_FRAME_HEIGHT)

data = []
totalMatches = 0
globalMin = 10000
globalMax = 0

fourcc = int(cap.get(cv.CV_CAP_PROP_FOURCC))
fourcc = cv2.cv.CV_FOURCC(*'DIVX')
outVid = cv2.VideoWriter('data/output.avi',fourcc,int(fps),(int(frameWidth),int(frameHeight)),True)

while(cap.isOpened()):
    ret, frame = cap.read()

    if(not ret):
        break

    pos_frames = cap.get(cv.CV_CAP_PROP_POS_FRAMES)
    pos_msec = cap.get(cv.CV_CAP_PROP_POS_MSEC)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    img = gray
    
    rows = img.shape[0]
    cols2 = img.shape[1]

    cols = cols2 / 2

    left = img[:,:cols]
    right = img[:,cols:]

    match = m.match(left,right)

    mobj = utils.Bunch(match)

    img3 = d.drawDisparity(match)
    img3 = cv2.flip(img3,0)
    outVid.write(img3)

    numMatches = len(mobj.matchDisparities)
    totalMatches = totalMatches + numMatches

    dataItem = {
        "frame":pos_frames,
        "timestamp":pos_msec,
        "numMatches":numMatches,
        "totalMatches":totalMatches
    }

    # dataItem['matches'] = formatMatchPoints(match)

    matchesTmp = formatMatchPoints(match)

    dataItem['matchDistanceStats'] = matchPointStats(matchesTmp)
    globalMin = min(globalMin, dataItem['matchDistanceStats']['min'])
    globalMax = max(globalMax, dataItem['matchDistanceStats']['max'])

    count = count + 1

    data.append(dataItem)

    if d.DISPLAY() :
        d.displayDisparity(match)
        if cv2.waitKey(0) & 0xFF == ord('q'):
            break

    print "Frame %d / %d" % (count,total_frames)

cap.release()
outVid.release()

out = {'dataMinMatchDistance':globalMin,
    'dataMaxMatchDistance':globalMax}
out['data'] = data

myjson = json.dumps(out)

txt = open("data/output.json", "w")
txt.write(myjson)
txt.close()

myjson = json.dumps(out, sort_keys=True,indent=4,separators=(',',': '))

txt = open("data/output.pretty.json", "w")
txt.write(myjson)
txt.close()

cap.release()
cv2.destroyAllWindows()
