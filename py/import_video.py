import cv2
import numpy as np
from matplotlib import pyplot as plt

template = cv2.imread('template246.png',0)
w, h = template.shape[::-1]

# All the 6 methods for comparison in a list
methods = ['cv2.TM_CCOEFF']#, 'cv2.TM_CCOEFF_NORMED', 'cv2.TM_CCORR',
#            'cv2.TM_CCORR_NORMED', 'cv2.TM_SQDIFF', 'cv2.TM_SQDIFF_NORMED']

num_methods = len(methods)

res_out = [0] * num_methods
img_out = [0] * num_methods

img_num = 0

cap = cv2.VideoCapture('student1.avi')
count = 0

while(cap.isOpened()):
    ret, frame = cap.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    img = gray
    img2 = img.copy()

    for i, meth in enumerate(methods):
        img = img2.copy()
        method = eval(meth)

        # Apply template Matching
        res = cv2.matchTemplate(img,template,method)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

        # If the method is TM_SQDIFF or TM_SQDIFF_NORMED, take minimum
        if method in [cv2.TM_SQDIFF, cv2.TM_SQDIFF_NORMED]:
            top_left = min_loc
        else:
            top_left = max_loc
        bottom_right = (top_left[0] + w, top_left[1] + h)

        cv2.rectangle(img,top_left, bottom_right, 255, 2)

        res_out[i] = res
        img_out[i] = img

    # cv2.imshow('frame',img)
    # if cv2.waitKey(0) & 0xFF == ord('q'):
        # break

    # rows = 2
    # cols = num_methods
    # plt_num = 1

    # for i, meth in enumerate(methods):
    #     plt.subplot(rows,cols,plt_num),plt.imshow(res,cmap = 'gray')
    #     plt.title('Matching Result %s' % meth), plt.xticks([]), plt.yticks([])
    #     plt_num += 1

    # for i, meth in enumerate(methods):
    #     plt.subplot(rows,cols,plt_num),plt.imshow(img,cmap = 'gray')
    #     plt.title('Detected Point %s' % meth), plt.xticks([]), plt.yticks([])
    #     plt_num += 1

    # plt.suptitle('%03d'%img_num)
    # plt.show(block=False)
    # plt.clf()

cap.release()
cv2.destroyAllWindows()