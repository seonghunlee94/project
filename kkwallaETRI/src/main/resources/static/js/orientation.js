$(window).on("orientationchange",function(){
   if(window.orientation == 0) // Portrait
	{
		$('#cover').hide();
	}
   else // Landscape
	{
		$('#cover').show();
	}
});