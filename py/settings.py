import cv2

def DISPLAY():
	return True

def IMSHOW_WAIT():
	while True:
		if cv2.waitKey(0) & 0xFF == ord('q'):
   			break