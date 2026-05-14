# Personal Website for AI, Knowledge Work, and Banking Transformation

This is a clean static website for a professional profile, case studies, downloads, and thought leadership around:

- Banking transformation
- AI and agentic systems
- Knowledge work redesign
- KYC and onboarding
- Decision flow
- Enterprise AI adoption

The site is intentionally simple. It uses plain HTML, Tailwind CSS from the CDN, a small custom stylesheet, and minimal vanilla JavaScript.

## Structure

```text
/
├── index.html
├── about.html
├── case-studies/
│   ├── maxit.html
│   └── onbo.html
├── downloads/
│   └── index.html
├── insights/
│   └── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── README.md
```

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

## Suggested Next Steps

- Replace placeholder profile copy with personal biographical details.
- Add real downloadable PDFs or private gated asset links.
- Expand the Maxit and Onbo case studies with visuals, diagrams, and project-specific details.
- Add a contact section or dedicated contact page.
- Add metadata images and social sharing tags.
- Decide whether the email capture should connect to a real service such as Buttondown, ConvertKit, Mailchimp, HubSpot, or an AWS-backed form handler.
- Add lightweight analytics if needed.

## Hosting on AWS S3

This site can be hosted as a static website on Amazon S3.

High-level steps:

1. Create an S3 bucket for the website.
2. Upload the full contents of this repository.
3. Enable static website hosting on the bucket.
4. Set `index.html` as the index document.
5. Configure public access or serve through CloudFront with an appropriate bucket policy.
6. Optionally connect a custom domain using Route 53 and CloudFront.

Because the site is static and uses relative links, it can be deployed without a backend or build process.
