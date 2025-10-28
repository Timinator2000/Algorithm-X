from PIL import Image

# List of PNGs to combine (use your local paths)
sizes = [16, 32, 48, 180, 512]
img = Image.open("docs/images/favicon-512x512.png")

# Save as a single .ico file
img.save("docs/images/favicon.ico", format="ICO", sizes=[(s, s) for s in sizes])
