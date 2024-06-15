import cv2
import numpy as np
import sys

def butterworth_lowpass_filter(d0, n, shape):
    P, Q = shape
    H = np.zeros((P, Q), dtype=np.float32)
    for u in range(P):
        for v in range(Q):
            D_uv = np.sqrt((u - P/2)**2 + (v - Q/2)**2)
            H[u, v] = 1 / (1 + (D_uv / d0)**(2*n))
    return H

def apply_butterworth_filter(image_path, output_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    dft = np.fft.fft2(image)
    dft_shift = np.fft.fftshift(dft)
    d0 = 30
    n = 2
    H = butterworth_lowpass_filter(d0, n, image.shape)
    filtered_dft_shift = dft_shift * H
    filtered_dft = np.fft.ifftshift(filtered_dft_shift)
    filtered_image = np.fft.ifft2(filtered_dft)
    filtered_image = np.abs(filtered_image)
    cv2.imwrite(output_path, filtered_image)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python butterworth_filter.py <input_image_path> <output_image_path>")
        sys.exit(1)


    image_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        result_path =  apply_butterworth_filter(image_path,output_path)
        print(result_path)
    except Exception as e:
        print("Error: {e}")
        sys.exit(1)
