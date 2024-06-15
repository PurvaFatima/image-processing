import cv2
from skimage import exposure
import sys
import os


def apply_histogram_matching(source_path, reference_path, output_path):
    try:
    
        if not os.path.exists(source_path):
            raise FileNotFoundError(f"Source image file not found: {source_path}")
        if not os.path.exists(reference_path):
            raise FileNotFoundError(f"Reference image file not found: {reference_path}")

        src_image = cv2.imread(source_path, cv2.IMREAD_COLOR)
        ref_image = cv2.imread(reference_path, cv2.IMREAD_COLOR)

        if src_image is None:
            raise ValueError(f"Failed to load source image: {source_path}")
        if ref_image is None:
            raise ValueError(f"Failed to load reference image: {reference_path}")

        print("Images loaded successfully")

        matched_image = exposure.match_histograms(src_image, ref_image, channel_axis=-1)
        cv2.imwrite(output_path, matched_image)

        print("Histogram matching applied successfully")
        return output_path

    except Exception as e:
        print(f"Error in apply_histogram_matching: {e}")
        raise e

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python histogram_matching.py <input_image_path> <reference_image_path> <output_image_path>")
        sys.exit(1)

    source_path = sys.argv[1]
    reference_path = sys.argv[2]
    output_path = sys.argv[3]

    try:
        result_path = apply_histogram_matching(source_path, reference_path, output_path)
        print(f"Output saved at: {result_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
