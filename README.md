# Chatta with mbare
Chatta with mbare is a web chat and video call application, made with Angular and NodeJS, made for a university assignment for Web Programming, Design and Usability course.
## Application design
This application follows the client-server pattern, with NodeJS providing services such as websockets communications and message dispatching, and the client providing the interface the users would use to chat and videocall with their fellas;
furthermore, as I love the concept of actions provided by NgRx and Redux, I chose this concept both on client and server, the server is indeed a dispatcher of messages, the sessions just listens to their inbound messages or public events, while they can dispatch other messages to other clients, but resulted in a nightmare 'cos I haven't provided a clear separation of server and client actions.
### Server design
The server uses SocketIO to provide both manageable websocket connections, expressjs to provide static resources such as the client and user pictures and a single real GET call to get a list of 'em.
Each connection via websockets goes through the SessionManager, as the user provides its own uuid, it just checks if it is connected, if not create a new Session which proxies actions between the global server' dispatcher and the client itself, once the connection get lost or closed, SessionManager disposes Session.
Server does not store any info about users.
### Client design
The client is made with Angular to provide a comfy UI and just 'cos I have been working with it these last 5 years I got addicted and forgot how to work without it; the style is inspired by GNOME's borderless mocks.
It uses NgRx to provide states and side-effects, Dexie to store messages and pals so you can write to them even when not connected ( provided you both will be online at some point ); SocketIO-client to bridge events from servers to client and viceversa; PeerJS handles streaming calls, sadly this would connect to their own server as it is incompatible with SocketIO in the backend.
### Issues encountered.
 1. This is the first time I make a video call application and didn't know where to start.
 2. I tried to use RxDB to provide storage, it is usually great with Angular, albeit it has bad perfs and documentation, this time it was so frustating, I had to search for alternatives, Dexie came in yet it does not have live queries.
 3. Mobile devices have incorrect viewport units, ALL OF THEM, 'cos they do not take in account their navigation bar, this trick saved the day: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/.
 4. Unnecessary large project hell, as I could easily follow a PeerJS+SocketIO tutorial and get away with it.
 5. PeerJS and SocketIO do not like each other, you cannot have both of them in the same port.
 6. Angular doesn't updates UI if source's not gone through NgZone, made a pipe for under client's `src/utils`, this happens when say instantiate a non angular related class that provides Observables or Promises, they aren't tracked by the async pipe.
 7. Call management is hell, I had rewritten it at least 6 times, 'cos you have you and your pal, sharing a stream and then one of you wants to stream your screen, so a new call must be made. As a side note, I found this by Mozilla https://blog.mozilla.org/webrtc/warm-up-with-replacetrack/ which helped a lot, TL;DR; you always start a complete stream with video+audio, but content is dummy, tracks are replaced as you request or unrequest mic or webcam use with dummy ones or viceversa.
 8. Angular lazy loading would not load a lazy's lazy child: one trick I used to make call and answer, is to guard both `/app/avchat/answer/:uuid` and `/app/avchat/call/:uuid` , when you try to call your pal, the client tries to navigate to the latter, and fires the guard which waits for pal's answer, but pal's must be redirected by a session's event, and `router.navigate(['/app/avchat/answer',caller])` didn't work at all, so I thought I could redirect from `RootModule`'s router, which is parent of `CallModule`, to its child with `redirect: 'url...'`, and then it worked.

# Build me plz
git clone this repo, then by cli go under app and write  `npm i`, then `npm run build`, these commands will install some gigs of deps for angular and build the client under `server/static/client`, then change dir to server, run `npm i` again, then `node index` and you are good to go, server is hosted by default at `0.0.0.0:8080`.