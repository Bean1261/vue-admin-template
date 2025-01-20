from PIL import Image
import numpy as np


width, height = 5000, 5500
array = np.random.randint(0, 256, (height, width, 3), dtype=np.uint8)
image = Image.fromarray(array)


image.save("large_image.jpg", format="JPEG", quality=85) 