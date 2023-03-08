# https://codesandbox.io/s/opencv-js-face-detection-i1i3u?file=/src/App.jsx

import cv2

def main():
  # face_cascade = cv2.CascadeClassifier('haarcascade_profileface.xml')

  face_detector = cv2.FaceDetectorYN_create(
    "face_detection_yunet_2022mar.onnx",
    "",
    (0, 0),  # input size
    0.4,     # confidence threshold
    0.1      # NMS threshold
  )

  cap = cv2.VideoCapture(0)
  ret, img = cap.read()
  while ret:
    channels = 1 if len(img.shape) == 2 else img.shape[2]
    if channels == 1:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if channels == 4:
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

 
    height, width, _ = img.shape
    face_detector.setInputSize((width, height))

    _, faces = face_detector.detect(img)
    faces = faces if faces is not None else []
    # Draw rectangle around the faces
    for face in faces:
      box = list(map(int, face[:4]))
      x, y, w, h = box
      x = max(0, x)
      y = max(0, y)
      img[y:y+h, x:x+w] = cv2.blur(img[y:y+h, x:x+w], (50, 50))
    # Display the output
    cv2.imshow("img", img)

    k = cv2.waitKey(1) & 0xff
    if k == 27:
        break
    
    ret, img = cap.read()

if __name__ == "__main__":
  main()
