# GitHub Pages Survey Deployment

Architecture:

GitHub Pages survey page -> Google Apps Script Web App -> Google Sheets

## 1. Create the Google Sheet endpoint

1. Create a new Google Sheet.
2. Open `Extensions` > `Apps Script`.
3. Paste the contents of `google_apps_script_code.gs`.
4. Deploy as a Web App.
5. Set access according to your institution policy. For public survey links, the web app usually needs to be accessible to anyone with the link.
6. Copy the Web App URL ending in `/exec`.

## 2. Configure the survey page

Open `config.js` and replace:

```js
PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
```

with the Web App URL.

## 3. Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. Go to `Settings` > `Pages`.
4. Select `Deploy from a branch`.
5. Select the main branch and root folder.
6. Share the generated `https://...github.io/...` URL with students.

## 4. Response storage

Responses are submitted to the configured Google Apps Script endpoint and appended to the `Responses` sheet. The browser also keeps a local backup so the survey administrator can still download CSV/JSON from the page if the network or endpoint fails.
