import subprocess
import time
import requests
import os
import htmlmin

# Minify JS
def minify_js():
    subprocess.run(["./node_modules/.bin/rollup", "-c"])

def minify_css():
# Minify CSS
    files = [
        "normalize.css",
        "style.css",
        "buttons.css",
        "notifications.css",
        "tooltips.css",
        "equipment.css",
        "events.css",
        "footer.css"
    ]
    css_text = ""
    for filename in files:
        filepath = os.path.join("./src/style", filename)
        with open(filepath, 'r') as readfile:
            css_text += readfile.read()
    response = requests.post("http://cssminifier.com/raw", data={"input": css_text})
    minified_css = response.text
    with open("docs/style.css", 'w') as outfile:
        outfile.write(minified_css)
    print("Compressed CSS to docs/style.css")

def minify_html():
    with open("src/index.html", 'r') as readfile:
        html = readfile.read()
        minified = htmlmin.minify(html, remove_comments=True, remove_empty_space=True)
        with open("docs/index.html", 'w') as outfile:
            outfile.write(minified)
    print("Compressed HTML to docs/index.html")
            
def main():
    print("Building...")
    start = time.time()
    minify_js()
    minify_css()
    minify_html()
    end = time.time()
    print("Finished in " + str(round(end - start, 2)) + "ms")

if __name__ == '__main__':
    main()
