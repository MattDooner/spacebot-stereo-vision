class Bunch(object):
    def __init__(self,adict):
        self.__dict__.update(adict)

def extractPoints(matchDict, mp):
    # print matchDict
   #mat = matchDict['matchDisparities']['match']
    mat = mp['match']
    img1_idx = mat.queryIdx
    img2_idx = mat.trainIdx

    # x - columns
    # y - rows
    (x1,y1) = matchDict['leftKp'][img1_idx].pt
    (x2,y2) = matchDict['rightKp'][img2_idx].pt
    return x1,y1,x2,y2