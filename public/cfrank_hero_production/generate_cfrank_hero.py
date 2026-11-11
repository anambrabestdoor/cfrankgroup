"""
CFrank Group — Master 3D Architectural Hero Animation (v4.0 — Cinematic Vitality)
Key fixes from v3.0 review:
1. Camera reoriented: front facade + main entrance door face the viewer directly.
2. Strong three-tone face shading: top (lightest), front-left (mid), front-right (dark) — building reads immediately against dark BG.
3. Building scaled up 40% and centred in the right 55% of frame.
4. Open cutaway on the front-right face reveals interior: sanitary wares (white WC, basin), warm glow.
5. Main copper entrance door reposition to front-left face — dominant and immediately visible.
6. Warm amber interior glow bleeds out from window/door cutouts as light pools on the ground.
7. All diagnostic text, datum ticks, and stage labels stripped from video pixels.
8. Perimeter hard-locked to exact #121518.
"""

import os
import sys
import math
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

WIDTH  = 1920
HEIGHT = 1080
RENDER_SCALE = 2          # 3840×2160 internal
INTERNAL_W = WIDTH  * RENDER_SCALE
INTERNAL_H = HEIGHT * RENDER_SCALE

FPS           = 30
DURATION_SEC  = 14.0
TOTAL_FRAMES  = int(FPS * DURATION_SEC)   # 420

# ── Brand colours (BGR for OpenCV) ─────────────────────────────────────────
BG_BGR   = (24, 21, 18)       # #121518
AMBER    = (27, 102, 243)     # #F3661B
CHALK    = (220, 227, 229)    # #E5E3DC
GRID_BGR = (38, 33, 28)

# Warm interior glow
WARM_GLOW  = (160, 200, 255)   # soft golden-orange light
WARM_GLOW2 = (110, 155, 220)

# ── Architectural material palette ─────────────────────────────────────────
# Strong contrast between three face directions: top / front-left / right-side
# Top faces (skylit — warmest, lightest)
TOP_ROOF   = (110, 92, 78)      # warm slate
TOP_PLAST  = (130, 122, 112)    # warm limestone cream
TOP_PANEL  = (88, 78, 68)

# Front-left faces (lit by main elevation light — midtone, clearly lighter than BG)
FL_ROOF    = (90, 74, 62)
FL_PLAST   = (120, 110, 100)
FL_PANEL   = (82, 72, 62)

# Right-side faces (shadow — darker but not invisible)
RS_ROOF    = (58, 48, 40)
RS_PLAST   = (78, 70, 62)
RS_PANEL   = (52, 46, 40)

# Turkish security door — rich copper/bronze
DOOR_CU_T  = (58, 110, 195)    # top lit face  #BGR
DOOR_CU_F  = (46, 90, 168)     # front face
DOOR_CU_S  = (32, 68, 130)     # shadow face
DOOR_PANEL = (62, 118, 205)    # embossed panel insert
STAINLESS  = (240, 240, 240)   # pull bar

# Interior HDF door — warm walnut
HDF_F = (68, 100, 142)
HDF_S = (48, 72, 108)

# Sanitary china — high-purity white (must pop against dark interior)
CHINA   = (248, 248, 248)
CHINA_S = (200, 200, 200)
BRASS   = (58, 158, 218)       # polished gold tap (BGR)

# ── Isometric projection setup ──────────────────────────────────────────────
# Standard cabinet isometric: 30° from horizontal for X and Y axes
# Origin at ~59% across, 76% down — building sits right-centre, left col clear for text
COS30 = math.cos(math.radians(30))
SIN30 = math.sin(math.radians(30))

ORIGIN_X = int(INTERNAL_W * 0.57)
ORIGIN_Y = int(INTERNAL_H * 0.88)   # Lower origin to bring building down, giving roof >120px clearance
ISO_SCALE = 70.0 * RENDER_SCALE     # Sized so full house fits with comfortable top and bottom padding

def project_iso(x, y, z):
    """Standard isometric: X axis goes right-down, Y axis goes left-down, Z is up."""
    u = ORIGIN_X + (x - y) * COS30 * ISO_SCALE
    v = ORIGIN_Y - (z * ISO_SCALE + (x + y) * SIN30 * ISO_SCALE)
    depth = x + y - z * 0.5
    return int(round(u)), int(round(v)), depth

def ease_out_cubic(t):
    return 1.0 - (1.0 - t) ** 3

def ease_in_quart(t):
    return t ** 4

# ── Pre-compute atmospheric radial background ───────────────────────────────
RADIAL_BG = np.full((INTERNAL_H, INTERNAL_W, 3), BG_BGR, dtype=np.uint8)
cx_bg = int(INTERNAL_W * 0.62)
cy_bg = int(INTERNAL_H * 0.50)
max_d = math.sqrt(INTERNAL_W**2 + INTERNAL_H**2)

yy, xx = np.ogrid[:INTERNAL_H, :INTERNAL_W]
dist_bg = np.sqrt((xx - cx_bg)**2 + (yy - cy_bg)**2)
norm_d  = np.clip(dist_bg / (max_d * 0.56), 0.0, 1.0)
glow    = (1.0 - norm_d) * 0.52   # strong warm lift at centre

# Target glow colour (BGR): warm charcoal #2A2218 ≈ (24, 34, 42)
for c_i, (base, peak) in enumerate(zip(BG_BGR, (28, 36, 48))):
    ch = base + (peak - base) * glow
    RADIAL_BG[:, :, c_i] = np.clip(ch, 0, 255).astype(np.uint8)


# ── Helper: draw a filled+outlined face quad ───────────────────────────────
def draw_face(canvas, pts_2d, fill_col, edge_col=CHALK, edge_thick=2):
    poly = np.array(pts_2d, dtype=np.int32)
    cv2.fillPoly(canvas, [poly], fill_col, lineType=cv2.LINE_AA)
    cv2.polylines(canvas, [poly], isClosed=True,
                  color=edge_col, thickness=edge_thick * RENDER_SCALE,
                  lineType=cv2.LINE_AA)


# ── Helper: draw a box with correct face shading ───────────────────────────
def draw_box(canvas, x0, y0, z0, x1, y1, z1,
             col_top, col_fl, col_rs,
             edge_col=CHALK, edge_thick=2, alpha=1.0,
             fade_to=None):
    """
    col_top = top face (Z=z1)
    col_fl  = front-left face (Y=y0, viewer-facing)
    col_rs  = right-side face (X=x1, viewer-facing)
    alpha: fade amount (1=solid, 0=invisible)
    """
    if alpha <= 0.0:
        return

    def blended(col):
        if fade_to is None or alpha >= 1.0:
            return col
        return tuple(int(c * alpha + bg * (1.0 - alpha)) for c, bg in zip(col, fade_to))

    # 8 corners
    corners = {}
    for xi, xv in [(0, x0), (1, x1)]:
        for yi, yv in [(0, y0), (1, y1)]:
            for zi, zv in [(0, z0), (1, z1)]:
                corners[(xi, yi, zi)] = project_iso(xv, yv, zv)

    def pts(face_corners):
        return [corners[c][0:2] for c in face_corners]

    # Collect faces with depth
    faces = []
    # Top face (Z=z1) — always lit
    top_pts = pts([(0,0,1),(1,0,1),(1,1,1),(0,1,1)])
    top_depth = sum(corners[c][2] for c in [(0,0,1),(1,0,1),(1,1,1),(0,1,1)]) / 4
    faces.append((top_depth, top_pts, blended(col_top), edge_col))

    # Front-left face (Y=y0)
    fl_pts = pts([(0,0,0),(1,0,0),(1,0,1),(0,0,1)])
    fl_depth = sum(corners[c][2] for c in [(0,0,0),(1,0,0),(1,0,1),(0,0,1)]) / 4
    faces.append((fl_depth, fl_pts, blended(col_fl), edge_col))

    # Right-side face (X=x1)
    rs_pts = pts([(1,0,0),(1,1,0),(1,1,1),(1,0,1)])
    rs_depth = sum(corners[c][2] for c in [(1,0,0),(1,1,0),(1,1,1),(1,0,1)]) / 4
    faces.append((rs_depth, rs_pts, blended(col_rs), edge_col))

    faces.sort(key=lambda f: -f[0])   # painter's: farthest first
    for _, f_pts, f_col, e_col in faces:
        draw_face(canvas, f_pts, f_col, e_col, edge_thick)


# ── Build the architectural house ──────────────────────────────────────────
# Coordinate system (metres):
#   X: left → right (front-left face visible)
#   Y: front → back
#   Z: bottom → top
#
# House footprint: X 0–6, Y 0–5
# Entrance door on front-left face (Y=0), centred at X 0.6–2.6
# Interior cutaway: front-right quarter exposed

def build_house_parts():
    """Returns list of (stage_idx, draw_fn) callables that draw at a given opacity."""
    parts = []

    # ─ STAGE 1: Foundation + steps ──────────────────────────────
    def stage1(canvas, alpha, fade_bg):
        a = alpha
        # Main slab
        draw_box(canvas, -0.3,-0.3,0.0, 6.3,5.3,0.30,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        # Entrance steps (front-left, Y < 0)
        draw_box(canvas, 0.5,-1.1,0.0, 2.8,-0.3,0.15,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        draw_box(canvas, 0.5,-0.9,0.15, 2.8,-0.3,0.30,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
    parts.append((1, stage1))

    # ─ STAGE 2: Walls + cantilever ──────────────────────────────
    def stage2(canvas, alpha, fade_bg):
        a = alpha
        # Ground-floor perimeter walls
        # Back wall (Y=5)
        draw_box(canvas, 0.0,4.72,0.30, 6.0,5.0,3.1,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        # Left wall (X=0)
        draw_box(canvas, 0.0,0.0,0.30, 0.28,5.0,3.1,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        # Right wall (X=6) with side window opening
        draw_box(canvas, 5.72,0.0,0.30, 6.0,1.6,3.1,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        draw_box(canvas, 5.72,3.4,0.30, 6.0,5.0,3.1,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        draw_box(canvas, 5.72,1.6,2.3,  6.0,3.4,3.1,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        # Front wall (Y=0) — with entrance opening (X 0.5–2.8) and cutaway (X 3.8–5.72)
        # NOTE: section X 3.8–5.72 is intentionally open (cutaway) to show interior
        # Entrance amber lintel beam
        draw_box(canvas, 0.28,0.0,2.65, 2.8,0.28,3.1,
                 AMBER, AMBER, AMBER, edge_col=AMBER, alpha=a, fade_to=fade_bg)

        # First-floor cantilevered slab (projects 0.9m front, 0.4m sides)
        draw_box(canvas, -0.3,-0.9,3.1, 6.3,5.2,3.40,
                 TOP_PANEL, FL_PANEL, RS_PANEL, alpha=a, fade_to=fade_bg)
        # Cantilever soffit amber reveal
        draw_box(canvas, 0.0,-0.9,3.1, 6.0,-0.85,3.14,
                 AMBER, AMBER, AMBER, edge_col=AMBER, edge_thick=1, alpha=a, fade_to=fade_bg)

        # Upper floor walls (warm limestone plaster)
        # Left wall
        draw_box(canvas, 0.0,-0.7,3.40, 0.28,4.8,6.1,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        # Back wall
        draw_box(canvas, 0.0,4.52,3.40, 6.0,4.8,6.1,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        # Right wall
        draw_box(canvas, 5.72,-0.7,3.40, 6.0,4.8,6.1,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        # Front upper wall with large window opening (X 0.4–3.8)
        draw_box(canvas, 3.8,-0.7,3.40, 5.0,-0.42,6.1,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        draw_box(canvas, 5.0,-0.7,3.40, 6.0,-0.42,6.1,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        # Upper window sill & head
        draw_box(canvas, 0.28,-0.7,3.40, 3.8,-0.42,3.90,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
        draw_box(canvas, 0.28,-0.7,5.70, 3.8,-0.42,6.10,
                 TOP_PLAST, FL_PLAST, RS_PLAST, alpha=a, fade_to=fade_bg)
    parts.append((2, stage2))

    # ─ STAGE 3: Stone-coated roof ───────────────────────────────
    def stage3(canvas, alpha, fade_bg):
        a = alpha
        # Ridge at Y=2.1, peak Z=7.4
        z_base = 6.1
        z_ridge = 7.4
        # Front slope (Y=−0.7 to 2.1)
        front_slope = [
            project_iso(-0.5,-1.0, z_base+0.1)[0:2],
            project_iso(6.5, -1.0, z_base+0.1)[0:2],
            project_iso(6.5,  2.1, z_ridge   )[0:2],
            project_iso(-0.5, 2.1, z_ridge   )[0:2],
        ]
        # Back slope (Y=2.1 to 5.4)
        back_slope = [
            project_iso(-0.5, 2.1, z_ridge   )[0:2],
            project_iso(6.5,  2.1, z_ridge   )[0:2],
            project_iso(6.5,  5.5, z_base+0.1)[0:2],
            project_iso(-0.5, 5.5, z_base+0.1)[0:2],
        ]
        for slope, col in [(front_slope, TOP_ROOF), (back_slope, FL_ROOF)]:
            poly = np.array(slope, dtype=np.int32)
            if a < 1.0:
                blended = tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip(col, fade_bg))
            else:
                blended = col
            cv2.fillPoly(canvas, [poly], blended, lineType=cv2.LINE_AA)
            edge_a = tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip(CHALK, fade_bg)) if a < 1.0 else CHALK
            cv2.polylines(canvas, [poly], isClosed=True,
                          color=edge_a, thickness=2*RENDER_SCALE, lineType=cv2.LINE_AA)

        # Ridge highlight in amber
        ridge_col = AMBER if a >= 1.0 else tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip(AMBER, fade_bg))
        r_l = project_iso(-0.55, 2.0, z_ridge+0.08)[0:2]
        r_r = project_iso( 6.55, 2.0, z_ridge+0.08)[0:2]
        cv2.line(canvas, r_l, r_r, ridge_col, 4*RENDER_SCALE, cv2.LINE_AA)

        # Tile courses on front slope
        for c_idx in range(7):
            y_c = -0.9 + c_idx * 0.44
            z_c = z_base + 0.14 + c_idx * 0.18
            pl = project_iso(-0.4, y_c, z_c)[0:2]
            pr = project_iso( 6.4, y_c, z_c)[0:2]
            tc = (60, 50, 42) if a >= 1.0 else tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip((60,50,42), fade_bg))
            cv2.line(canvas, pl, pr, tc, 2*RENDER_SCALE, cv2.LINE_AA)

    parts.append((3, stage3))

    # ─ STAGE 4: Doors, windows, smart lock ─────────────────────
    def stage4(canvas, alpha, fade_bg):
        a = alpha
        def bc(col):  # blend colour
            if a >= 1.0: return col
            return tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip(col, fade_bg))

        # 1. GRAND TURKISH COPPER ENTRANCE DOOR (front-left face Y=0)
        # Amber architrave surround
        draw_box(canvas, 0.50,-0.08,0.30, 0.60, 0.22,2.72,
                 bc(AMBER), bc(AMBER), bc(AMBER), edge_col=bc(AMBER), edge_thick=2, alpha=1.0)
        draw_box(canvas, 2.70,-0.08,0.30, 2.80, 0.22,2.72,
                 bc(AMBER), bc(AMBER), bc(AMBER), edge_col=bc(AMBER), edge_thick=2, alpha=1.0)
        draw_box(canvas, 0.50,-0.08,2.62, 2.80, 0.22,2.72,
                 bc(AMBER), bc(AMBER), bc(AMBER), edge_col=bc(AMBER), edge_thick=2, alpha=1.0)

        # Main door leaf (copper/bronze face)
        draw_box(canvas, 0.60,-0.06,0.30, 2.70, 0.14,2.62,
                 bc(DOOR_CU_T), bc(DOOR_CU_F), bc(DOOR_CU_S), alpha=1.0)

        # Embossed panels (lighter copper)
        draw_box(canvas, 0.72,-0.08,0.48, 1.46,-0.05,1.38,
                 bc(DOOR_PANEL), bc(DOOR_PANEL), bc(DOOR_CU_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)
        draw_box(canvas, 0.72,-0.08,1.56, 1.46,-0.05,2.52,
                 bc(DOOR_PANEL), bc(DOOR_PANEL), bc(DOOR_CU_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)
        draw_box(canvas, 1.60,-0.08,0.48, 2.58,-0.05,1.38,
                 bc(DOOR_PANEL), bc(DOOR_PANEL), bc(DOOR_CU_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)
        draw_box(canvas, 1.60,-0.08,1.56, 2.58,-0.05,2.52,
                 bc(DOOR_PANEL), bc(DOOR_PANEL), bc(DOOR_CU_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)

        # Astragal divider between door halves
        draw_box(canvas, 1.60,-0.09,0.30, 1.68,-0.04,2.62,
                 bc(AMBER), bc(AMBER), bc(AMBER), edge_col=bc(AMBER), edge_thick=1, alpha=1.0)

        # Stainless steel pull bar — gleaming white-silver
        draw_box(canvas, 1.46,-0.11,0.95, 1.52,-0.08,1.95,
                 bc(STAINLESS), bc(STAINLESS), bc((180,180,180)), edge_col=bc((255,255,255)), edge_thick=2, alpha=1.0)

        # Smart biometric lock escutcheon (black body + amber LED ring)
        draw_box(canvas, 1.42,-0.10,1.35, 1.58,-0.06,1.68,
                 bc((14,14,14)), bc((10,10,10)), bc((8,8,8)), edge_col=bc(AMBER), edge_thick=2, alpha=1.0)
        # Amber LED ring pixel row
        led_p = project_iso(1.50, -0.09, 1.52)[0:2]
        cv2.circle(canvas, led_p, 7*RENDER_SCALE, bc(AMBER), -1, cv2.LINE_AA)

        # 2. UPPER FLOOR BALCONY ROOM DOOR (front face Y=−0.7 upper floor)
        draw_box(canvas, 3.9,-0.72,3.40, 5.0,-0.56,5.70,
                 bc(HDF_F), bc(HDF_F), bc(HDF_S), alpha=1.0)
        draw_box(canvas, 4.05,-0.74,3.65, 4.85,-0.70,4.42,
                 bc(HDF_F), bc((90,130,170)), bc(HDF_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)
        draw_box(canvas, 4.05,-0.74,4.60, 4.85,-0.70,5.50,
                 bc(HDF_F), bc((90,130,170)), bc(HDF_S), edge_col=bc(CHALK), edge_thick=1, alpha=1.0)
        # Handle
        draw_box(canvas, 4.80,-0.76,4.72, 4.86,-0.72,4.90,
                 bc(AMBER), bc(AMBER), bc(AMBER), edge_col=bc(AMBER), edge_thick=1, alpha=1.0)

        # 3. UPPER FLOOR WINDOW (warm glow fill)
        win_pts = [
            project_iso(0.30,-0.44,3.95)[0:2],
            project_iso(3.80,-0.44,3.95)[0:2],
            project_iso(3.80,-0.44,5.68)[0:2],
            project_iso(0.30,-0.44,5.68)[0:2],
        ]
        glow_col = bc(WARM_GLOW)
        poly = np.array(win_pts, dtype=np.int32)
        cv2.fillPoly(canvas, [poly], glow_col, lineType=cv2.LINE_AA)
        cv2.polylines(canvas, [poly], isClosed=True, color=bc(CHALK), thickness=2*RENDER_SCALE, lineType=cv2.LINE_AA)
        # Window mullion
        m_top = project_iso(2.05,-0.44,5.68)[0:2]
        m_bot = project_iso(2.05,-0.44,3.95)[0:2]
        cv2.line(canvas, m_top, m_bot, bc(RS_PLAST), 2*RENDER_SCALE, cv2.LINE_AA)

        # 4. SIDE WINDOW (right face X=6, warm glow)
        sw_pts = [
            project_iso(6.0, 1.7, 1.05)[0:2],
            project_iso(6.0, 3.3, 1.05)[0:2],
            project_iso(6.0, 3.3, 2.30)[0:2],
            project_iso(6.0, 1.7, 2.30)[0:2],
        ]
        poly2 = np.array(sw_pts, dtype=np.int32)
        cv2.fillPoly(canvas, [poly2], bc(WARM_GLOW2), lineType=cv2.LINE_AA)
        cv2.polylines(canvas, [poly2], isClosed=True, color=bc(CHALK), thickness=2*RENDER_SCALE, lineType=cv2.LINE_AA)

    parts.append((4, stage4))

    # ─ STAGE 5: Sanitary wares + interior cutaway ───────────────
    def stage5(canvas, alpha, fade_bg):
        a = alpha
        def bc(col):
            if a >= 1.0: return col
            return tuple(int(c * a + bg * (1.0 - a)) for c, bg in zip(col, fade_bg))

        # Warm interior back wall (bathroom zone — wider cutaway X=3.8–5.72, Y=0–3.0)
        back_wall_pts = [
            project_iso(3.8, 0.0, 0.30)[0:2],
            project_iso(5.72,0.0, 0.30)[0:2],
            project_iso(5.72,0.0, 3.10)[0:2],
            project_iso(3.8, 0.0, 3.10)[0:2],
        ]
        bw_col = bc((80, 72, 64))
        poly = np.array(back_wall_pts, dtype=np.int32)
        cv2.fillPoly(canvas, [poly], bw_col, lineType=cv2.LINE_AA)

        # Warm glow floor pool — wider to match cutaway
        glow_floor = [
            project_iso(3.9, 0.1, 0.31)[0:2],
            project_iso(5.68,0.1, 0.31)[0:2],
            project_iso(5.68,3.2, 0.31)[0:2],
            project_iso(3.9, 3.2, 0.31)[0:2],
        ]
        gf_col = bc((55, 70, 95))
        cv2.fillPoly(canvas, [np.array(glow_floor, dtype=np.int32)], gf_col, lineType=cv2.LINE_AA)

        # 1. RIMLESS WC SUITE — white vitreous china — moved further right for sightline
        # Cistern
        draw_box(canvas, 5.0,1.80,0.30, 5.60,2.30,1.20,
                 bc(CHINA), bc(CHINA), bc(CHINA_S),
                 edge_col=bc((255,255,255)), edge_thick=2, alpha=1.0)
        # Pan/bowl
        draw_box(canvas, 5.02,1.30,0.30, 5.58,1.83,0.74,
                 bc(CHINA), bc(CHINA), bc(CHINA_S),
                 edge_col=bc((255,255,255)), edge_thick=2, alpha=1.0)
        # Gold flush button
        fp = project_iso(5.30, 2.05, 1.20)[0:2]
        cv2.circle(canvas, fp, 6*RENDER_SCALE, bc(BRASS), -1, cv2.LINE_AA)

        # 2. VANITY WASH BASIN (wall-mounted, cantilevered pedestal) — larger for visibility
        draw_box(canvas, 4.12,0.55,0.30, 4.98,1.42,0.84,
                 bc((52, 46, 40)), bc((42, 36, 30)), bc((32, 28, 24)),
                 alpha=1.0)  # dark pedestal
        # White basin top — extra contrast pop
        draw_box(canvas, 4.08,0.50,0.84, 5.02,1.48,1.02,
                 bc(CHINA), bc(CHINA), bc(CHINA_S),
                 edge_col=bc((255,255,255)), edge_thick=2, alpha=1.0)
        # Gold tap — taller for legibility
        draw_box(canvas, 4.48,1.00,1.02, 4.60,1.18,1.32,
                 bc(BRASS), bc(BRASS), bc((40,120,180)),
                 edge_col=bc(BRASS), edge_thick=1, alpha=1.0)

        # 3. SHOWER ENCLOSURE (glass panel + rain column, right wall)
        # Glass panel (semi-transparent blue-grey tint)
        glass_pts = [
            project_iso(5.68, 2.6, 0.30)[0:2],
            project_iso(5.68, 3.9, 0.30)[0:2],
            project_iso(5.68, 3.9, 2.40)[0:2],
            project_iso(5.68, 2.6, 2.40)[0:2],
        ]
        g_col = bc((80, 68, 56))
        cv2.fillPoly(canvas, [np.array(glass_pts, dtype=np.int32)], g_col, lineType=cv2.LINE_AA)
        cv2.polylines(canvas, [np.array(glass_pts, dtype=np.int32)], True,
                      bc((200,200,200)), 2*RENDER_SCALE, cv2.LINE_AA)
        # Rain shower head
        draw_box(canvas, 5.52,3.0,2.14, 5.65,3.2,2.28,
                 bc(STAINLESS), bc(STAINLESS), bc((160,160,160)),
                 edge_col=bc(STAINLESS), edge_thick=1, alpha=1.0)
        draw_box(canvas, 5.56,3.0,2.00, 5.60,3.2,2.14,
                 bc(STAINLESS), bc(STAINLESS), bc((160,160,160)),
                 edge_col=bc(STAINLESS), edge_thick=1, alpha=1.0)

    parts.append((5, stage5))

    return parts


# ── Ground grid ─────────────────────────────────────────────────────────────
def draw_ground_grid(canvas, alpha):
    if alpha <= 0.02:
        return
    col = tuple(int(c * alpha + bg * (1.0 - alpha)) for c, bg in zip(GRID_BGR, BG_BGR))
    for gx in range(-1, 8):
        p0 = project_iso(gx, -1, 0)[0:2]
        p1 = project_iso(gx,  6, 0)[0:2]
        cv2.line(canvas, p0, p1, col, 1*RENDER_SCALE, cv2.LINE_AA)
    for gy in range(-1, 7):
        p0 = project_iso(-1, gy, 0)[0:2]
        p1 = project_iso( 7, gy, 0)[0:2]
        cv2.line(canvas, p0, p1, col, 1*RENDER_SCALE, cv2.LINE_AA)
    # Origin crosshair in amber
    u0, v0, _ = project_iso(0, 0, 0)
    amber_a = tuple(int(c * alpha + bg * (1.0 - alpha)) for c, bg in zip(AMBER, BG_BGR))
    cv2.line(canvas, (u0-14*RENDER_SCALE, v0), (u0+14*RENDER_SCALE, v0), amber_a, 2*RENDER_SCALE, cv2.LINE_AA)
    cv2.line(canvas, (u0, v0-14*RENDER_SCALE), (u0, v0+14*RENDER_SCALE), amber_a, 2*RENDER_SCALE, cv2.LINE_AA)


# ── Down-light pool on entrance threshold ───────────────────────────────────
def draw_downlights(canvas, opacity):
    if opacity <= 0.0:
        return
    for ox, oy, ex, ey in [(1.3,-0.15,70,28), (2.1,-0.15,55,22)]:
        u, v, _ = project_iso(ox, oy, 0.31)
        glow = tuple(int(c * opacity) for c in (55, 75, 110))
        cv2.ellipse(canvas, (u, v), (ex*RENDER_SCALE, ey*RENDER_SCALE),
                    -30, 0, 360, glow, -1, cv2.LINE_AA)


# ── Render one frame ────────────────────────────────────────────────────────
def render_frame(t, house_parts):
    canvas = RADIAL_BG.copy()

    # Stage animation timings (seconds)
    stage_start = {1: 0.0, 2: 2.2, 3: 4.8, 4: 7.2, 5: 9.6}
    stage_dur   = {1: 2.0, 2: 2.4, 3: 2.2, 4: 2.2, 5: 2.2}

    is_resetting = t >= 12.6
    reset_prog   = min(1.0, (t - 12.6) / 1.4) if is_resetting else 0.0

    stage_prog = {}
    for idx, start in stage_start.items():
        dur = stage_dur[idx]
        raw = (t - start) / dur
        stage_prog[idx] = min(1.0, max(0.0, raw))

    # Grid fades in with stage 1, fades out on reset
    grid_alpha = ease_out_cubic(stage_prog[1])
    if is_resetting:
        grid_alpha *= max(0.0, 1.0 - ease_in_quart(reset_prog))
    draw_ground_grid(canvas, grid_alpha)

    # Draw all parts
    for s_idx, draw_fn in house_parts:
        s_p = stage_prog.get(s_idx, 0.0)
        if s_p <= 0.0:
            continue

        e_p = ease_out_cubic(s_p)
        if is_resetting:
            e_p *= max(0.0, 1.0 - ease_in_quart(reset_prog) * 1.2)
        if e_p <= 0.0:
            continue

        draw_fn(canvas, e_p, BG_BGR)

    # Down-lights appear with stage 4 (doors)
    dl_opacity = ease_out_cubic(stage_prog[4]) if not is_resetting else ease_out_cubic(stage_prog[4]) * (1.0 - ease_in_quart(reset_prog))
    if stage_prog[2] > 0.7:
        draw_downlights(canvas, dl_opacity * 0.8)

    # Downsample 3840×2160 → 1920×1080
    out = cv2.resize(canvas, (WIDTH, HEIGHT), interpolation=cv2.INTER_AREA)

    # Hard-lock 30px perimeter to exact #121518
    out[0:30,  :]  = BG_BGR
    out[-30:,  :]  = BG_BGR
    out[:,  0:30]  = BG_BGR
    out[:, -30:]   = BG_BGR

    return out


# ── OBJ export ──────────────────────────────────────────────────────────────
def export_obj(filepath_obj, filepath_mtl):
    with open(filepath_mtl, 'w') as f:
        f.write("# CFrank Group Architectural Materials\n")
        f.write("newmtl Mat_CharcoalBase\nKd 0.08 0.09 0.10\n\n")
        f.write("newmtl Mat_AmberAccent\nKd 0.95 0.40 0.10\n\n")
        f.write("newmtl Mat_TurkishDoorCopper\nKd 0.65 0.36 0.20\n\n")
        f.write("newmtl Mat_SanitaryChina\nKd 0.97 0.97 0.97\n\n")
        f.write("newmtl Mat_WarmGlow\nKd 1.0 0.90 0.78\nKe 0.8 0.72 0.62\n\n")

    with open(filepath_obj, 'w') as f:
        f.write("# CFrank Group — Architectural House v4.0\n")
        f.write(f"mtllib {os.path.basename(filepath_mtl)}\n\n")
        # Simplified bounding box vertices for OBJ
        boxes = [
            ("Foundation", "Mat_CharcoalBase",  [(-0.3,-0.3,0.0),(6.3,5.3,0.30)]),
            ("Walls",      "Mat_CharcoalBase",  [(0.0,0.0,0.30),(6.0,5.0,6.1)]),
            ("Roof",       "Mat_CharcoalBase",  [(-0.5,-1.0,6.1),(6.5,5.5,7.4)]),
            ("Door",       "Mat_TurkishDoorCopper", [(0.60,-0.06,0.30),(2.70,0.14,2.62)]),
            ("WC",         "Mat_SanitaryChina", [(4.65,1.70,0.30),(5.28,2.10,1.10)]),
            ("Basin",      "Mat_SanitaryChina", [(4.10,0.60,0.82),(4.95,1.40,0.98)]),
        ]
        vi = 1
        for name, mat, (mn, mx) in boxes:
            f.write(f"o {name}\nusemtl {mat}\n")
            x0,y0,z0 = mn; x1,y1,z1 = mx
            verts = [(x0,y0,z0),(x1,y0,z0),(x1,y1,z0),(x0,y1,z0),
                     (x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1)]
            for vx,vy,vz in verts:
                f.write(f"v {vx:.4f} {vy:.4f} {vz:.4f}\n")
            faces = [(1,2,3,4),(5,6,7,8),(1,2,6,5),(2,3,7,6),(3,4,8,7),(4,1,5,8)]
            for fi in faces:
                f.write("f " + " ".join(str(vi+i-1) for i in fi) + "\n")
            vi += 8
            f.write("\n")
    print(f"3D OBJ exported: {filepath_obj}")


def export_blender_script(filepath):
    s = '''"""Blender 4.x scene setup for CFrank Group Hero (v4.0). Run: blender --python setup_blender_scene.py"""
import bpy, math
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath="cfrank_house_model.obj")
world = bpy.data.worlds.new("CFrank_World")
bpy.context.scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes.get("Background")
if bg: bg.inputs[0].default_value = (0.071, 0.082, 0.094, 1.0)
cam_d = bpy.data.cameras.new("IsoCamera"); cam_d.type = "ORTHO"; cam_d.ortho_scale = 14.0
cam = bpy.data.objects.new("IsoCamera", cam_d)
bpy.context.collection.objects.link(cam); bpy.context.scene.camera = cam
cam.location = (22, -22, 18); cam.rotation_euler = (math.radians(60), 0, math.radians(45))
bpy.context.scene.render.resolution_x = 1920; bpy.context.scene.render.resolution_y = 1080
print("Scene ready.")
'''
    with open(filepath, 'w') as f:
        f.write(s)
    print(f"Blender script: {filepath}")


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    print("=" * 70)
    print("CFrank Group — 3D Hero Generator v4.0 (Cinematic Vitality)")
    print(f"Canvas: {WIDTH}x{HEIGHT} (2× supersampled) | {DURATION_SEC}s @ {FPS}fps = {TOTAL_FRAMES} frames")
    print("=" * 70)

    obj_path     = os.path.join(OUTPUT_DIR, "cfrank_house_model.obj")
    mtl_path     = os.path.join(OUTPUT_DIR, "cfrank_house_model.mtl")
    blender_path = os.path.join(OUTPUT_DIR, "setup_blender_scene.py")
    export_obj(obj_path, mtl_path)
    export_blender_script(blender_path)

    house_parts  = build_house_parts()
    raw_path     = os.path.join(OUTPUT_DIR, "temp_raw.mp4")
    fourcc       = cv2.VideoWriter_fourcc(*'mp4v')
    writer       = cv2.VideoWriter(raw_path, fourcc, FPS, (WIDTH, HEIGHT))

    print(f"Rendering {TOTAL_FRAMES} frames...")
    completed_frame = None

    for i in range(TOTAL_FRAMES):
        t     = (i / float(TOTAL_FRAMES)) * DURATION_SEC
        frame = render_frame(t, house_parts)
        writer.write(frame)

        if i == int(12.2 * FPS):
            completed_frame = frame.copy()

        if (i + 1) % 60 == 0 or i == TOTAL_FRAMES - 1:
            print(f"  Frame {i+1}/{TOTAL_FRAMES} ({(i+1)/TOTAL_FRAMES*100:.1f}%)")

    writer.release()
    print("Render complete.")

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    if completed_frame is not None:
        still_rgb = cv2.cvtColor(completed_frame, cv2.COLOR_BGR2RGB)
        pil       = Image.fromarray(still_rgb)
        png_path  = os.path.join(OUTPUT_DIR, "cfrank_hero_completed_house.png")
        webp_path = os.path.join(OUTPUT_DIR, "cfrank_hero_poster.webp")
        pil.save(png_path, "PNG")
        pil.save(webp_path, "WEBP", quality=95, method=6)
        print(f"PNG still:   {png_path}  ({os.path.getsize(png_path)/1024:.1f} KB)")
        print(f"WebP poster: {webp_path} ({os.path.getsize(webp_path)/1024:.1f} KB)")
        # Perimeter check
        corners = [(0,0),(WIDTH-1,0),(0,HEIGHT-1),(WIDTH-1,HEIGHT-1),
                   (WIDTH//2,5),(5,HEIGHT//2),(WIDTH-6,HEIGHT//2),(WIDTH//2,HEIGHT-6)]
        ok = all(tuple(completed_frame[cy,cx]) == BG_BGR for cx,cy in corners)
        print(f"Perimeter: {'PASSED' if ok else 'FAILED'}")

    mp4_path  = os.path.join(OUTPUT_DIR, "cfrank_hero_assembly.mp4")
    webm_path = os.path.join(OUTPUT_DIR, "cfrank_hero_assembly.webm")

    print("\nEncoding MP4...")
    subprocess.run([
        ffmpeg, "-y", "-i", raw_path,
        "-c:v","libx264","-profile:v","high","-level","4.2",
        "-pix_fmt","yuv420p","-crf","20","-preset","slow",
        "-movflags","+faststart", mp4_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"MP4: {mp4_path} ({os.path.getsize(mp4_path)/1024/1024:.2f} MB)")

    print("Encoding WebM...")
    subprocess.run([
        ffmpeg, "-y", "-i", raw_path,
        "-c:v","libvpx-vp9","-crf","26","-b:v","0", webm_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"WebM: {webm_path} ({os.path.getsize(webm_path)/1024/1024:.2f} MB)")

    if os.path.exists(raw_path):
        os.remove(raw_path)

    print("\n" + "=" * 70)
    print("DELIVERABLES v4.0:")
    print(f"  OBJ model:       {obj_path}")
    print(f"  Blender script:  {blender_path}")
    print(f"  PNG still:       {png_path}")
    print(f"  WebP poster:     {webp_path}")
    print(f"  WebM video:      {webm_path}")
    print(f"  MP4 video:       {mp4_path}")
    print("=" * 70)


if __name__ == "__main__":
    main()
