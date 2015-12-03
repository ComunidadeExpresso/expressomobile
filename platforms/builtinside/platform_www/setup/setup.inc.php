<?php



	/* Basic information about this app */
	$setup_info['email']['name']      = 'email';
	$setup_info['email']['title']     = 'Email';
	$setup_info['email']['version']   = '1.0';
	$setup_info['email']['app_order'] = 1;
	$setup_info['email']['enable']    = 1;

	/* The tables this app creates */
	$setup_info['email']['tables']    = array('phpgw_email');

	/* The hooks this app includes, needed for hooks registration */
	$setup_info['email']['hooks'][] = 'admin';
	// $setup_info['email']['hooks'][] = 'home';
	// $setup_info['email']['hooks'][] = 'sidebox_menu';
	// $setup_info['email']['hooks'][] = 'settings';
	// $setup_info['email']['hooks'][] = 'preferences';

	/* Dependencies for this app to work */
	$setup_info['news_admin']['depends'][] = array(
		 'appname' => 'phpgwapi',
		 'versions' => Array('2.2')
	);

