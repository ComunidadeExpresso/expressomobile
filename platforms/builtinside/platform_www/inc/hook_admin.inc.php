<?php

	{
		$file = Array
		(
			'Global Categories'	=> $GLOBALS['phpgw']->link('/index.php','menuaction=admin.uicategories.index&appname=' . $appname),
		);
		display_section($appname,$appname,$file);
	}
?>
