# CrossCountry Staff App — Mobile Offline PWA

## Mobile app features
- Installable on supported Android and iPhone/iPad devices.
- Standalone app-style launch from the home screen.
- Offline-capable after the first successful online load.
- Save drafts locally on the device.
- Clear individual pages and remove saved drafts.
- Generate emails using the device's default email application.
- Generate HTML form exports.
- Print and export individual forms.

Saved drafts are held in the app/browser's local storage on the device. Clearing browser or app data may remove saved drafts.

To install, host these files on an HTTPS-enabled web server, open the site on the device, then use Install App / Add to Home Screen.


## Visual design
The interface has been redesigned to follow the supplied XC mobile reference: amber header, warm off-white surfaces, XC crimson action areas, white cards, and mobile-first spacing.


## Home page and page source
The mobile home page now provides quick-access cards for every item identified as a `Page:` entry in the supplied source. The separate `Design instructions` entry is not created as an app page.


## Email recipients
Each page now contains an Email recipient field. The user enters the recipient address before selecting Generate Email; no recipient addresses are hard-coded into the app.
