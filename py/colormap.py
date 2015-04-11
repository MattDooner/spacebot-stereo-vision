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
        self.valuerange = float(endmap - startmap)
        self.ratios = (self.endcolor - self.startcolor) / self.valuerange

    def __getitem__(self, value):
        color = tuple(self.startcolor + (self.ratios * (value - self.startmap)))
        return (int(color[0]), int(color[1]), int(color[2]))