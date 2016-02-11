<?

$origin_server = $_REQUEST['origin_server'];

if ($origin_server != '') {
	echo "<script> window.localStorage.setItem('ORIGIN_SERVER', '" . $origin_server . "'); </script>";
}

$file_handle = fopen("index.html", "r");
while (!feof($file_handle)) {
   $line = fgets($file_handle);
   echo $line;
}
fclose($file_handle);

?>