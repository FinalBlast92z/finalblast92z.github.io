<?php
set_include_path(dirname(__FILE__).'/include');

require_once('init.inc.php');

$path = sanitize_path_request($_SERVER['PATH_INFO']);

$cachefile = $waveform['cachedir'].'/'.sha1($path);

$mp3file = $waveform['snddir'].'/'.$path;

if(!is_file($mp3file))
   exit(fatal_error("Error: requested file $mp3file not found"));

if(!file_exists($cachefile)) {
   $cmdline = 'waveform draw "'.$mp3file.'" "'.$cachefile.'" 0 -1';
   $system_rv = null;

   system($cmdline, $system_rv);

   if($system_rv!=0) {
      if(file_Exists($cachefile))
         unlink($cachefile);

      exit(fatal_error('Error: generating the waveform diagram failed'));
   }
}

header('Content-type: image/jpeg');

echo file_get_contents($cachefile);

