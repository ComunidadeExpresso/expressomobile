<?

$origin_server = $_REQUEST['origin_server'];

echo "<script>";
if ($origin_server != '') {
	echo "window.localStorage.setItem('ORIGIN_SERVER', '" . $origin_server . "');";
}

$protocolo    = (strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === false) ? 'http' : 'https';
$redirect_url     = $protocolo . '://' . $_SERVER['HTTP_HOST'] . '/index.html';

echo " window.location.href='" . $redirect_url . "';";
echo "</script>";

// $file_handle = fopen("index.html", "r");
// while (!feof($file_handle)) {
//    $line = fgets($file_handle);
//    echo $line;
// }
// fclose($file_handle);

?>