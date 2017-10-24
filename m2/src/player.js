/* Copyright (C) 2013, 2014 Tilman Kranz <tilt@linuxfoo.de>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:           
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE */

var MyPlayer = function(_args) {
   var failed = false;
   var detached = false;
   var player = null;

   var defaultArgs = {
      detachable: true,
      element: 'body',
      id3: false,
      mode: 'mp3url',
      waveform: false,
      autoplay: false,
      loop: true,
      shuffle: false,
      list: []
   };

   var args = (typeof(_args)==='undefined') 
      ? defaultArgs 
      : $.extend({}, defaultArgs, _args);   

   var createAudio = function() {
      var autoplay = args.autoplay ? 'autoplay="true"' : '';

      $(args.element).append(
         '<audio controls="controls" ' + autoplay + '>'+
            '<p>'+
               'Your browser does not understand '+
               'the &lt;audio&gt; tag. '+
            '</p>'+
         '</audio>'
      );

      args.audio = args.element + ' audio';
   }

   var readId3 = function() {
      $(args.element).find('ul.mejs li').each(function(i, track){
         var url = $(track).attr('data-url');

         $(track).prepend('<span class="ajaxLoader">&nbsp;</span>&nbsp;');
   
         ID3.loadTags(url, function() {
            var tags = ID3.getAllTags(url);
            
            if(typeof(tags.title)!='undefined') {
               var track_title = tags.title;
   
               if(typeof(tags.artist)!='undefined')
                  track_title = tags.artist + ' - ' + track_title;

               $(args.element).find('ul.mejs li').each(function(j, _track){
                  if(i==j)
                     $(_track).html(track_title);
               });
            }
         });
      });
   }

   var playerCreated = function() {
      restoreParams();
      
      if(args.id3)
         readId3();
   }

   var createPlayer = function() {
      player = new MediaElementPlayer(
         $(args.audio), {
            success: playerCreated,
            loop: args.loop, 
            shuffle: args.shuffle, 
            playlist: true,
            audioHeight: 32, 
            playlistposition: 'bottom',
            features: ['playlistfeature', 'prevtrack', 'playpause',
               'nexttrack', 'loop', 'shuffle', 'current', 'progress',
               'duration', 'volume'],
            pluginPath: mejs.Utility.getScriptPath(['myplayer.min.js'])+'../plugins/'
      });

      $(args.element).append(
         '<p class="playerDetached" style="display: none;">'+
            'The player is currently detached.'+
         '</p>'
      );
   }

   var param = function(name) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");

      for(var i=0; i<vars.length; i++) {
         var pair = vars[i].split("=");

         if(pair[0] == name)
            return pair[1];
      }

      return false;
   }

   var setupDetach = function() {
      if(!args.detachable)
         return;

      var popup = function(url) {
         player.pause();
         $('.mejs-audio').hide();
         $('.playerDetached').show();

         var playerWindow = window.open(
            url, 'myplayer',
            'height='+ Math.max($(args.element).height(), 298)+','+
            'width='+408+','+
            'resizable=false'
         );

         if(window.focus) 
            playerWindow.focus();

         $("iframe",top.document).height(20);

         return false;
      }

      if(param('popup')==false) {
         $('.mejs-controls').append(
            '<div id="popupButton" '+
                'class="popupButton">'+
                    '<button '+
                        'title="Open in separate window" '+
                        'type="button">'+
                    '</button>'+
            '</div>'
         );

         $('.popupButton button').click(function(){
            var currentTime = player.getCurrentTime();
            var volume = player.getVolume();
            var paused = player.media.paused;
            var trackNo = 0;

            $(args.element).find('ul.mejs li').each(function(i){
               if($(this).hasClass('current'))
                   trackNo = i;
            });

            popup(
               $(location).attr('href')+'?'+
                  'popup&'+
                  'paused='+paused+'&'+
                  'currentTime='+currentTime+'&'+
                  'volume='+volume+'&'+
                  'trackNo='+trackNo
            )
         });
      }
      else {
         var windowHeight = $(window).height();

         window.onbeforeunload = function(){
            $("iframe", opener.top.document).height(windowHeight);
            $('.mejs-audio', opener.document).show();
            $('.playerDetached', opener.document).hide();
         }
      }
   }

   var restoreParams = function() {
      if(!detached)
         return;

      var paused = (param('paused') && param('paused')=='true');
      var currentTime = param('currentTime') ? parseFloat(param('currentTime')) : 0.0;
      var volume = param('volume') ? parseFloat(param('volume')) : 1.0;
      var trackNo = param('trackNo') ? parseInt(param('trackNo')) : 0;

      player.setVolume(volume);

      $(args.element).find('ul.mejs li').each(function(i){
         if(i==trackNo) {
            player.playTrack($(this));
            player.setCurrentTime(currentTime);
         }
      });

      if(paused)
         player.pause();
   }

   if(param('popup')!==false) {
      detached = true;

      $('body').html(
         '<div '+
            'id="myplayer" '+
            'style="'+
               'width: '+$(args.element).width()+'px; '+
               'height: '+$(args.element).height()+' px;'+
         '"></div>'
      );

      args.element = '#myplayer';
   }

   if(args.mode=='mp3url') {
      var mp3url = (typeof args.mp3url === "undefined") 
         ? $(location).attr('href').replace(/\?.*/, '').replace(/\/[^\/]+\/?$/, '')
         : args.mp3url;
   
      $.ajax({
         url: mp3url,
         type: 'GET',
         success: function(res) {
            createAudio();
   
            var doc = document.createElement('html');
            doc.innerHTML = res;
   
            var head = $(doc).find('a').each(function(idx,item) {
               var src = $(item).attr('href');

               if(src.match(/\.mp3$/)) {
                  var url = mp3url+'/'+src;
                  var title = item.innerHTML;

                  $(args.audio).append('<source src="'+url+'" title="'+title+'"/>');
                }
            });
   
            createPlayer();
            setupDetach();
         }
      });
   }
   else if(args.mode=='m3u') {
      var m3u = (typeof args.m3u === "undefined") 
         ? $(location).attr('href').replace(/\?.*/, '').replace(/\/[^\/]+\/?$/, '/play.m3u')
         : args.m3u;

      createAudio();

      $.get(m3u, function(txt){
         var lines = txt.split("\n");

         for(var i = 0, len = lines.length; i < len; i++)
            if(!lines[i].match(/^[ \t]*#/) && lines[i].match(/\.mp3$/)) {
                var mp3 = lines[i];
                var title = unescape(mp3.split('/').pop());

                $(args.audio).append('<source src="'+mp3+'" title="'+title+'"/>');
            }

         createPlayer();
         setupDetach();
      }); 
   }
   else if(args.mode=='list') {
      createAudio();

      for(var i = 0, len = args.list.length; i < len; i++) {
          var item = args.list[i];
          var type = typeof item;
          var src = '';
          var title = '';

          if(item !== null && type === 'object') {
             if(item.url)
                src = item.url;
             else {
                alert(
                    'MyPlayer: item[' + i + ']: '+
                    'property "url" is missing.'
                );

                continue;
             }

             if(item.title)
                title = item.title;
             else
                title = url.replace(/(.*\/)?([^\/]+)/, '$2');
          }
          else if(type === 'string') {
             src = item;
             title = src;
          }
          else {
             alert(
                'MyPlayer: item [' + i + ']: '+
                'unsupported type "' + type + '"'
             );

             continue;
          }

          $(args.audio).append('<source src="'+src+'" title="'+title+'"/>');
      }

      createPlayer();
      setupDetach();
   }
   else {
      $(args.element).append('<p>Unsupported mode "'+args.mode+'"</p>');
      failed = true;
   }
}

