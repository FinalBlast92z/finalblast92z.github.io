#!/bin/sh
# MyPlayer - Copyright 2014 tilt@linuxfoo.de GPLv3
# Build Script; recompiles the MyPlayer JavaScript from source.

cd $(dirname $0)

echo '/*
jQuery
   Copyright 2014 jQuery Foundation and other contributors
   http://jquery.com/
MediaElement.js
   Copyright 2010-2013, John Dyer (http://j.hn)
MediaElement Playlist Feature (plugin) -
   Andrew Berezovsky <andrew.berezovsky@gmail.com>
   and Junaid Qadir Baloch <shekhanzai.baloch@gmail.com>
JavaScript-ID3-Reader
   Copyright (c) 2008 Jacob Seidelin, http://blog.nihilogic.dk/ BSD License
   Copyright (c) 2009 Opera Software ASA BSD License
   Copyright (c) 2010 AntÃ³nio Afonso BSD License
   Copyright (c) 2010 Joshua Kifer BSD License
MyPlayer
   Copyright (c) 2014 tilt@linuxfoo.de MIT License
*/' > ../js/myplayer.min.js

# https://developers.google.com/closure/compiler/
java \
   -jar /usr/local/lib/closure-compiler/compiler.jar \
   --js mediaelement-and-player.min.js \
   --js mep-feature-playlist.js \
   --js id3-minimized.js \
   --js player.js \
   >> ../js/myplayer.min.js

echo "Done: Javascript source has compiled into ../js/myplayer.min.js"
