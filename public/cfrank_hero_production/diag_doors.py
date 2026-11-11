import sys
import os
sys.path.append(os.path.abspath('public/cfrank_hero_production'))
import generate_cfrank_hero as g
import cv2
import numpy as np

# Load Scene 4 frame (at t=9.0s) and Scene 6 frame (at t=12.4s)
parts = g.build_refined_house()
frame_s4 = g.render_frame_supersampled(9.0, parts)
frame_s6 = g.render_frame_supersampled(12.4, parts)

cv2.imwrite('public/cfrank_hero_production/check_s4_doors.png', frame_s4)
cv2.imwrite('public/cfrank_hero_production/check_s6_doors.png', frame_s6)

# Check door faces
door_part = [p for p in parts if p.name == 'DoorsWindows'][0]
print("Total door faces:", len(door_part.faces))
for idx, f in enumerate(door_part.faces[:8]):
    pts = f['pts']
    cx = sum(p[0] for p in pts) / len(pts)
    cy = sum(p[1] for p in pts) / len(pts)
    cz = sum(p[2] for p in pts) / len(pts)
    u, v, depth = g.project_iso(cx, cy, cz)
    # Scale to output 1920x1080 (divide by 2)
    print(f"Face {idx}: 3D center=({cx:.2f}, {cy:.2f}, {cz:.2f}) -> 1080p 2D=({u//2}, {v//2}), depth={depth:.2f}, col={f['color']}")

