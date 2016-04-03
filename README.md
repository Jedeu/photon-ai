## Background:
This is our final project at Lighthouse Labs. We decided to each play to our interests and build on a photography idea. The idea is basically pinterest + instagram + spotify. A photographer or picture collector sees a cool picture on the internet, and wants to bookmark it for reference or as inspiration for future projects. They can hover over an image, click on the Photon.ai icon to save it (via the [chrome browser extension](https://github.com/Jedeu/photon-ai-extension)). The photo is then passed to Google's Vision for identification (using their neuronet). On the web app, users can then search the photos via the AI-generated labels.

## Stack:
Node.js + Express, Postgres
[Raccoon](https://www.npmjs.com/package/raccoon) on Redis
Vanilla JS + $ + [$.nested](https://github.com/suprb/nested/)
SCSS + [bulma](https://github.com/jgthms/bulma)

## Instructons:
`redis-server` to start the redis server
`npm start` to start server

## Philosophy:
Content & UX first, not sacrificing beautiful photos for clinical UI. Since the coding bootcamp didn't go in-depth into JS & Node, learn as much about those as we can.

## Stretch Goals (much ambition, very no time, wow):
- linking photos back to the source page where it's discovered, or source user profile
- using browser agent id and HTML5 <picture> tag to render optimised webp images
- server-side image resizing for premium users
- retry mobile-first approach, emphasis on bandwidth and low-latency
- learn to use asset pipeline manager to create .min.js, .min.css
- optimise search using an index rather than 3 nested loops and early return
- rewrite [$.nested](https://github.com/suprb/nested/), learn about it and make it more robust

## Uber Stretch Goals:
- photo EXIF data search and processing (similar to flickr)
- reverse image search to find the original photo and author
- users can edit photo tags coming from Google Vision, crowd-source
- blockchain to authenticate photo ownership, prevent image theft
- roll our own neuronet

# FEATURES
## Frontend:
- vanilla JS and jQuery MVC, models validations
- modularised frontend JS using module import to separate concern
- event-based API between modules using pubsub
- custom built and calibrated touch library
- some robustness of formatting and early return
- in-house image fitting to a 5x5 grid for $.nested, crop as little as possible

## Backend:
- Node.js with Express framework
- Postgres database with Sequelize as an ORM to store user, photo, and tag information
- Raccoon recommendation engine to generate recommendations based on similar users
- Redis database to store recommendation information

## Extension

More information about the Extension can be found [here](https://github.com/Jedeu/photon-ai-extension)
