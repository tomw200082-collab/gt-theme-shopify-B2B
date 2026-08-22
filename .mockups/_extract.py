import json, os, html as htmlmod

src = r"C:\Users\tomw2\AppData\Local\Temp\claude\c--Users-tomw2-GTeveryday-Dropbox-Data-Center-Tom-AI-Agents---Projects-Code-Agents-Website\6a34df38-5dd5-43e5-9c6e-2a513fe34e2a\tasks\wyvvw6ltz.output"
out = r"C:\Users\tomw2\gt-theme-shopify-B2B\.mockups"
os.makedirs(out, exist_ok=True)

raw = open(src, encoding="utf-8").read()
data = json.loads(raw)
# navigate into the workflow result wrapper
if isinstance(data, dict):
    for k in ("result", "results", "return", "value", "output"):
        if k in data:
            data = data[k]
            break
# result may be a JSON string holding the array
while isinstance(data, str):
    data = json.loads(data)
print("KEYS/COUNT:", len(data), "items")

for item in data:
    h = item.get("html") or ""
    if "<!DOCTYPE" not in h and "&lt;!DOCTYPE" in h:
        h = htmlmod.unescape(h)
    p = os.path.join(out, item["key"] + ".html")
    with open(p, "w", encoding="utf-8") as f:
        f.write(h)
    print(item["key"], "ok=" + str(item.get("ok")), "chars=" + str(len(h)), "->", p)
