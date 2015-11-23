<?php

	function getServices()
	{
		$im = CreateObject('phpgwapi.messenger');
		$_return = array();
		if ( $im->checkAuth() ) {
			$_return['chat'] = array(
				'chatDomain' => $im->domain,
				'chatUrl'    => $im->url,
			);
		}
		return $_return;
	}

	function getUserApps(){
		// Load Granted Apps for Web Service
		$config = parse_ini_file( '../api/config/user.ini',true);
		$apps 	= $config['Applications.mapping'];
	
		// Load Granted Apps for User
		$contactApps = array();
		$acl 	= CreateObject('phpgwapi.acl');
		$user_id = $GLOBALS['phpgw_info']['user']['account_id']['acl'];
		foreach($acl->get_user_applications($user_id) as $app => $value){
			$enabledApp = array_search($app, $apps);
			if($enabledApp !== FALSE)
				$contactApps[] = $enabledApp;
		}
	
		return $contactApps;
	}

	function getUserProfile() 
	{

		if ($GLOBALS['phpgw_info']['server']['use_https'] == 1)
		{
			$serverAPI = "https://" . $_SERVER['HTTP_HOST'] . "/api/rest/";
		} else {
			$serverAPI = "http://" . $_SERVER['HTTP_HOST'] . "/api/rest/";
		}

		$userAuth = $GLOBALS['phpgw']->session->sessionid .":".$GLOBALS['phpgw']->session->kp3;

			return 
	            json_encode(array(
	           	'auth'=> $userAuth,
	           	'phoneGap' => false,
	           	'serverAPI' => $serverAPI,
	           	'profile' => 
					array(
							'contactID'				=> $GLOBALS['phpgw_info']['user']['account_dn'],
							'contactMails' 			=> array($GLOBALS['phpgw_info']['user']['email']),
							'contactPhones' 		=> array($GLOBALS['phpgw_info']['user']['telephonenumber']),
							'contactFullName'		=> $GLOBALS['phpgw_info']['user']['fullname'],
							'contactLID'			=> $GLOBALS['phpgw_info']['user']['account_lid'],
							'contactUIDNumber'		=> $GLOBALS['phpgw_info']['user']['account_id'],
							'contactApps'			=> getUserApps(),
							'contactServices'		=> getServices()

					)
				));

	}

	if (file_exists("../header.inc.php")) {

		$is_built_in_expresso = true;

	}

	if ($is_built_in_expresso) { 

		$phpgw_info = array();
		$GLOBALS['phpgw_info']['flags'] = array(
			'currentapp' => 'email',
			'noheader' => True,
			'nonavbar' => True,
		);
		include('../header.inc.php');
		
		$GLOBALS['phpgw']->common->phpgw_header();
		echo parse_navbar();

		$content = file_get_contents("./index_desktop.html");

		$profile = getUserProfile();

		?>
		<script>
			window.localStorage.setItem('expresso','<?=$profile?>');
		</script>
		<?
	
		echo $content;

		$GLOBALS['phpgw']->common->phpgw_footer(); 

	} else {

		echo "<script>window.location.href='http://" . $_SERVER['HTTP_HOST'] .  "/index.html';</script>";
	
	}

?>