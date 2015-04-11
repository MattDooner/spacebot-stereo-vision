import numpy as np

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
        print '#### colors ###'
        print self.valuerange
        print self.ratios

    def __getitem__(self, value):
        color = tuple(self.startcolor + (self.ratios * (value - self.startmap)))
        return (int(color[0]), int(color[1]), int(color[2]))