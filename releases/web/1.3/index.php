<?

$origin_server = $_REQUEST['origin_server'];

echo "<script>";
if ($origin_server != '') {
	echo "window.localStorage.setItem('ORIGIN_SERVER', '" . $origin_server . "');";
}

echo " window.location.href='index.html';";
echo "</script>";

?>