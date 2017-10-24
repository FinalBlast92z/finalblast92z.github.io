<?php

function fatal_error($msg, $status = '505 Internal Server Error') {
   header('Status: '.$status);

   echo $msg."\n";

   return 1;
}

function sanitize_path_request($path_info) {
   return preg_replace(
      array('|^/|', '/[^A-Za-z0-9\-\.]/'), 
      array('', ''), 
      $path_info
   );
}

