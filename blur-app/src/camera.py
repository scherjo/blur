import cv2

class VideoCamera(object):
  def __init__(self):
    self.video = cv2.VideoCapture(0)
    self.face_detector = cv2.FaceDetectorYN_create(
      "data/face_detection_yunet_2022mar.onnx",
      "",
      (0, 0),  # input size
      0.4,     # confidence threshold
      0.1      # NMS threshold
    )

  def __del__(self):
    self.video.release()

  def get_frame(self):
    ret, img = self.video.read()
    
    # cap = cv2.VideoCapture(0)
    # ret, img = cap.read()

    if ret:
      channels = 1 if len(img.shape) == 2 else img.shape[2]
      if channels == 1:
          img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
      if channels == 4:
          img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

  
      height, width, _ = img.shape
      self.face_detector.setInputSize((width, height))

      _, faces = self.face_detector.detect(img)
      faces = faces if faces is not None else []
      # Draw rectangle around the faces
      for face in faces:
        box = list(map(int, face[:4]))
        x, y, w, h = box
        x = max(0, x)
        y = max(0, y)
        img[y:y+h, x:x+w] = cv2.blur(img[y:y+h, x:x+w], (50, 50))

    ret, jpeg = cv2.imencode('.jpg', img)  
    return jpeg.tobytes()