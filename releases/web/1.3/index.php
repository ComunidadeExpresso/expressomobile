<?

$origin_server = $_REQUEST['origin_server'];

$script .= "<script>";

if ($origin_server != '') {
	$script .= "var ORIGIN_SERVER = '" . $origin_server . "'; " ; 
	$script .= "localStorage.setItem('ORIGIN_SERVER', '" . $origin_server . "');";
} else {
	$script .= "var ORIGIN_SERVER = localStorage.getItem('ORIGIN_SERVER'); " ; 
}

$script .= "</script>";

echo $script;

$file_handle = fopen("index.html", "r");
while (!feof($file_handle)) {
   $line = fgets($file_handle);
   echo $line;
}
fclose($file_handle);

?>