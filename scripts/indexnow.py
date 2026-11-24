"""Submit RobertLazau.com's pages to IndexNow (Bing and the other engines that use it).

- After a merge to main that changes the site, it waits until Vercel reports the deploy of that
  commit as done (the "Vercel" commit status), checks the key file is live, then submits the
  pages in the live sitemap.
- By hand from the Actions tab: the same pages, or every page in the sitemap when "all" is ticked.
The key in public/<key>.txt is public by design: IndexNow uses it only to prove the site owns the
submissions. Google doesn't use IndexNow; it reads the sitemap.
"""
import datetime, glob, json, os, re, sys, time, urllib.request, urllib.error

SITE = "https://www.robertlazau.com"
HOST = "www.robertlazau.com"
PUSH_SKIP = None
REPO = os.environ.get("GITHUB_REPOSITORY", "robertlazau-design/GoldenboyProductions")
SHA = os.environ.get("GITHUB_SHA", "")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
EVENT = os.environ.get("GITHUB_EVENT_NAME", "push")
SUBMIT_ALL = os.environ.get("SUBMIT_ALL") == "true"

files = [p for p in glob.glob("public/*.txt") if re.fullmatch(r"public/[0-9a-f]{32}\.txt", p)]
if len(files) != 1:
    sys.exit(f"Expected one IndexNow key file in public/, found {files or 'none'}.")
KEY = open(files[0]).read().strip()
if KEY != os.path.basename(files[0])[:-4]:
    sys.exit("The key file's name and contents don't match.")


def get(url, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": "golden-boy-indexnow/1.0", "Cache-Control": "no-cache", **(headers or {})})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def vercel_state():
    headers = {"Accept": "application/vnd.github+json"}
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    data = json.loads(get(f"https://api.github.com/repos/{REPO}/commits/{SHA}/status", headers))
    for s in data.get("statuses", []):  # newest first
        if s.get("context", "").startswith("Vercel"):
            return s.get("state")
    return None


# 1. After a merge, wait for Vercel to finish deploying that commit.
if EVENT == "push" and SHA:
    deadline = time.time() + 20 * 60
    while True:
        try:
            state = vercel_state()
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            state = f"unknown ({e})"
        if state == "success":
            break
        if state in ("failure", "error"):
            sys.exit(f"Vercel's deploy of {SHA[:7]} failed, so nothing was submitted.")
        if time.time() > deadline:
            sys.exit("The deploy didn't finish within 20 minutes, so nothing was submitted.")
        print(f"Waiting for Vercel to deploy {SHA[:7]} (status: {state})")
        time.sleep(20)
    time.sleep(30)  # let the new version reach the CDN

# 2. The key file has to be live, or IndexNow rejects the submission.
for _ in range(10):
    try:
        if get(f"{SITE}/{KEY}.txt").strip() == KEY:
            break
    except (urllib.error.URLError, TimeoutError):
        pass
    print("Waiting for the key file to go live")
    time.sleep(15)
else:
    sys.exit(f"The key file isn't live at {SITE}/{KEY}.txt, so nothing was submitted.")

# 3. Pick the pages from the live sitemap.
pages = []
for block in get(f"{SITE}/sitemap.xml?t={int(time.time())}").split("<url>")[1:]:
    loc = re.search(r"<loc>([^<]+)</loc>", block)
    if loc and loc.group(1).strip().startswith(SITE):
        lastmod = re.search(r"<lastmod>([^<]+)</lastmod>", block)
        pages.append((loc.group(1).strip().replace("&amp;", "&"), lastmod.group(1).strip()[:10] if lastmod else ""))
if SUBMIT_ALL:
    urls, why = [u for u, _ in pages], "every page in the sitemap"
elif EVENT == "schedule":
    since = (datetime.datetime.now(datetime.timezone.utc).date() - datetime.timedelta(days=1)).isoformat()
    urls, why = [u for u, d in pages if d and d >= since], f"pages dated {since} or later"
else:
    urls, why = [u for u, _ in pages if not (PUSH_SKIP and re.search(PUSH_SKIP, u))], "the site's pages"
if not urls:
    if EVENT == "schedule":
        print("Nothing new to submit today.")
        sys.exit(0)
    sys.exit("The live sitemap lists no pages, so nothing was submitted.")
print(f"Submitting {len(urls)} URL(s), {why}: {urls}")

# 4. Submit.
body = {"host": HOST, "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls}
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=json.dumps(body).encode(),
                             headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "golden-boy-indexnow/1.0"},
                             method="POST")
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        status = r.status
except urllib.error.HTTPError as e:
    sys.exit(f"IndexNow said {e.code}: {e.read().decode('utf-8', 'replace')[:300]}")
msg = f"IndexNow accepted {len(urls)} URL(s) (HTTP {status}), {why}."
print(msg)
summary = os.environ.get("GITHUB_STEP_SUMMARY")
if summary:
    with open(summary, "a") as f:
        f.write(f"### {msg}\n\n" + "\n".join(f"- {u}" for u in urls) + "\n")
