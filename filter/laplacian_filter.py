import cv2
import sys

def apply_laplacian_filter(image_path, output_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    laplacian_filtered = cv2.Laplacian(image, cv2.CV_64F)
    cv2.imwrite(output_path, laplacian_filtered)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python laplacian_filter.py <input_image_path> <output_image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    output_path = sys.argv[2]
 
    try:
        result_path = apply_laplacian_filter(image_path, output_path)
        print(result_path)
    except Exception as e:
        print("Error: {e}")
        sys.exit(1)
