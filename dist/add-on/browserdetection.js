/* This Script Uses Browser Detection (not recommended for most uses)
 *	to warn Android Stock Browser users that their browser may not support the script
 *	reference code can be found here: http://demo.chapmanit.com/browserdetection/
 */
$(document).ready(function() {
  /*if (navigator.userAgent.match(/msie/i) ){
	alert('I am an old fashioned Internet Explorer');
  }
  else if ( navigator.userAgent.match(/android/i) && navigator.userAgent.match(/2.3/i) ){
	alert('I am on android 2.3.X');
  }
  */
  if ( navigator.userAgent.match(/android 2./i) ){
	alert('Android\'s Stock Browser doesn\'t work well with jPlayer Playlists.  If you encounter difficulties, try loading in another browser.');
  }
  /*
  else{
	alert('I roll with '+ navigator.userAgent );
	}
	*/
});
