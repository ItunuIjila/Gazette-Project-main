<?php
$executionStartTime = microtime(true) / 1000;

$curl = curl_init();

curl_setopt_array($curl, [
	
	CURLOPT_URL => "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds=" . $_REQUEST['country'] . "&minPopulation=1000",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: wft-geo-db.p.rapidapi.com",
		"x-rapidapi-key: c715604ea6msh482d8130c40ae55p18bf57jsn1a3fb96e32a7"
	],
]);



$response = curl_exec($curl);
$err = curl_error($curl);

if($response === FALSE) {
    echo "cURL Error: " . curl_error($curl);
}

curl_close($curl);

$decode = json_decode($response, true);

//Update HTTP status messages:
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
//Show excution time:
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
//store the string of results in 'data':
$output['data'] = $decode;

//Content-type specifies the media type of the underlying data:
header('Content-Type: application/json; charset=UTF-8');

//prints the JSON representation of output (the status message and data):
echo json_encode($output);

?>