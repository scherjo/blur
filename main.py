import cv2

def main():
  # Load the cascade
  face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
  # Read the input image
  img = cv2.imread('images/test.jpeg')
  # Convert into grayscale
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
  # Detect faces
  faces = face_cascade.detectMultiScale(gray, 1.1, 4)
  # Draw rectangle around the faces
  for (x, y, w, h) in faces:
    #img[y:y+h, x:x+w] = cv2.medianBlur(img[y:y+h, x:x+w], 51)
    #cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
    img[y:y+h, x:x+w] = cv2.blur(img[y:y+h, x:x+w], (50, 50))
  # Display the output
  cv2.imshow('img', img)
  cv2.waitKey()

if __name__ == "__main__":
  main()
