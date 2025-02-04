# BeAware-LandingPage
Landing page for the [deafassitant.com](https://conferencecaptioning.com) website of BeAware

This repository contains the code of the Landing Page website for the [BeAware - Deaf & Hard of Hearing Assistant app for iPhone](https://conferencecaptioning.com)

The app itself is open-source and is written in SwiftUI. Here's the [code for the app](https://github.com/philparkus/BeAware)

To briefly understand what the app does, you can watch [this video](https://vimeo.com/950840441)

**Automating Translations**
--------
- Try to set all the languages to be in english in all the files so that we can do a search and replace
- Use HTML Translator sheet from here to create translations: https://docs.google.com/spreadsheets/d/1ocn1WHA4--EabfJ2eEZwZjz4orCIKo18rawDiJCZVYs/edit?gid=1537366283#gid=1537366283
- Then get the JSON value from here https://codepen.io/saamerm/pen/NWVZyEm and store it in a new file like languages-demoVideos.json
- Create a copy of demoVideo.sh and make the changes needed (especially the json file name). There's two parts to the shell script.
- Only commit needed files