<?php

  // table array for email
	$phpgw_baseline = array(
		'phpgw_email' => array(
			'fd' => array(
				'email_id' => array('type' => 'auto','nullable' => False),
				'email_username' => array('type' => 'varchar','precision' => '255','nullable' => True)
			),
			'pk' => array('email_id'),
			'fk' => array(),
			'ix' => array('email_username'),
			'uc' => array()
		)
	);
?>
