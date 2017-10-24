Project: MyPlayer - A Web-MP3-Player with Playlist Support
Author: tilt@linuxfoo.de
Release: 01-10-2014
License: MIT

About:

This project provides a JavaScript constructor MyPlayer({...options...}) that can be used
to embed lists of audio files as read from an index document or an M3U into a web document.

They will be displayed in a playback GUI with a playlist that can optionally be filled
from the "title" and "artist" values of the files' ID3 tags (v1 and v2 are supported).

The player is "detachable", meaning it can start in a detached state or the user can open
it in a new window, preventing that playback breaks when the user leaves the page.

Tested Compatibility:

MP3: Firefox, Chrome, Internet Exploder
OGG Audio: Firefox, Chrome

How to Use:

See demos/index.html for several examples.

How to Hack:

Directory src contains the input files. See player.js for the MyPLayer implementation.
Use build.sh (with the Google closure compiler) to rebuild myplayer.min.js.

The Flash and Silverlight plugins are taken from mediaelement.js and are included
in binary form only. If you want to modify them, use the mediaelement.js sources.
