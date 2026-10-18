import numpy as np
from PIL import Image

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img, dtype=np.float32)
    
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Calculate brightness / whiteness
    # Background is near white (r > 240, g > 240, b > 240)
    # The logo is dark blue (r ~ 0-20, g ~ 30-60, b ~ 130-160)
    whiteness = np.minimum(np.minimum(r, g), b)
    
    # Thresholds for anti-aliasing
    white_thresh = 248.0
    blue_thresh = 190.0
    
    # Calculate alpha: 0 for white, 255 for logo
    alpha = np.where(whiteness >= white_thresh, 0.0,
            np.where(whiteness <= blue_thresh, 255.0,
                     255.0 * (1.0 - (whiteness - blue_thresh) / (white_thresh - blue_thresh))))
    
    data[:, :, 3] = alpha
    
    # For anti-aliased pixels, remove the white blending from RGB
    # original = logo * alpha + white * (1 - alpha)
    # logo = (original - 255 * (1 - alpha)) / alpha
    alpha_norm = np.clip(alpha / 255.0, 0.001, 1.0)
    for c in range(3):
        unmixed = (data[:, :, c] - 255.0 * (1.0 - alpha_norm)) / alpha_norm
        data[:, :, c] = np.clip(unmixed, 0, 255)
        
    result = Image.fromarray(data.astype(np.uint8), mode='RGBA')
    
    # Crop to bounding box of non-transparent pixels with 20px padding
    bbox = result.getbbox()
    if bbox:
        # Add slight padding
        left = max(0, bbox[0] - 10)
        top = max(0, bbox[1] - 10)
        right = min(result.width, bbox[2] + 10)
        bottom = min(result.height, bbox[3] + 10)
        result = result.crop((left, top, right, bottom))
        
    result.save(output_path, 'PNG')
    print(f"Saved transparent logo to {output_path}, new size: {result.size}")

if __name__ == '__main__':
    remove_background('public/logo.png', 'public/logo-transparent.png')
    # Also save as the primary public/logo.png
    remove_background('public/logo.png', 'public/logo.png')
