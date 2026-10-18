import cv2
import os

video_path = r"new-building-plan/Duevy — Collect campus dues by bank transfer. No wahala. - Google Chrome 2026-10-18 20-14-55.mp4"
output_dir = r"new-building-plan/new_video_frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps
print(f"Video duration: {duration:.2f} seconds, total frames: {total_frames}, fps: {fps}")

# Extract frames every 2 seconds
interval = int(fps * 2)
count = 0
saved = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if count % interval == 0:
        sec = count / fps
        frame_name = os.path.join(output_dir, f"frame_{saved:02d}_sec_{sec:.1f}.jpg")
        cv2.imwrite(frame_name, frame)
        saved += 1
    count += 1

cap.release()
print(f"Extracted {saved} frames to {output_dir}")
