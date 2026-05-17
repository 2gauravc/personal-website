## How to Run Locally

Open `index.html` directly in a browser.

No build step, package install, backend, or database is required.

You can also run a local static server if preferred:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Hosting on AWS S3

```
aws s3 sync . s3://gc-pers-website \
  --delete \
  --exclude ".git/*"
  ```
