import cv2
import numpy as np
import sys
import os

# Test script for door rendering and visibility
sys.path.append(os.path.abspath('public/cfrank_hero_production'))
import generate_cfrank_hero as g

# Color constants
# Rich Architectural Copper/Bronze for Turkish Armoured Door:
# RGB: (166, 93, 50) -> BGR: (50, 93, 166)
DOOR_COPPER_BASE = (50, 93, 166)
DOOR_COPPER_LIGHT = (65, 115, 195)
DOOR_COPPER_DARK = (38, 70, 130)
# Interior HDF Warm Walnut:
# RGB: (108, 74, 52) -> BGR: (52, 74, 108)
DOOR_HDF_BASE = (52, 74, 108)
DOOR_HDF_LIGHT = (65, 92, 132)

print("Door color definitions ready.")

