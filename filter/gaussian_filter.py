import cv2
import sys

def apply_gaussian_filter(image_path, output_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        raise FileNotFoundError(f"Image file not found: {image_path}")

    gaussian_filtered = cv2.GaussianBlur(image, (5, 5), 0)
    cv2.imwrite(output_path, gaussian_filtered)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python apply_gaussian.py <input_image_path> <output_image_path>")
        sys.exit(1)
        
    image_path = sys.argv[1]
    output_path = sys.argv[2]
    try:
        result_path = apply_gaussian_filter(image_path, output_path)
        print(result_path)
    except Exception as e:
        print("Error: {e}")
        sys.exit(1)
