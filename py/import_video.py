import cv2
import numpy as np
from matplotlib import pyplot as plt
import settings as s
import match as m

cap = cv2.VideoCapture('data/test4-slam.avi')
count = 0

while(cap.isOpened()):
    ret, frame = cap.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    img = gray

    print img.shape
    
    rows = img.shape[0]
    cols2 = img.shape[1]

    cols = cols2 / 2

    left = img[:,:cols]
    right = img[:,cols:]

    m.match(left,right)

    if s.DISPLAY() :
        if cv2.waitKey(0) & 0xFF == ord('q'):
            break

    # if s.DISPLAY() :
    #     cv2.imshow('Left',left)
    #     cv2.imshow('Right',right)
    #     if cv2.waitKey(0) & 0xFF == ord('q'):
    #         break

cap.release()
cv2.destroyAllWindows()