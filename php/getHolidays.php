<?php

	$executionStartTime = microtime(true) / 1000;
    //$url="https://holidayapi.com/v1/holidays?pretty&country=" . $_REQUEST['country'] . "&year=2022&key=aaad04ec-c36b-4dc0-9dd3-0100b41567ee";
   

	//$url= 'https://holidayapi.com/v1/holidays?pretty&key=5b7bc58d-6717-4a21-92ef-d28b72d3033b&country=GB&year=2022';

    $url= "https://holidayapi.com/v1/holidays?pretty&key=5b7bc58d-6717-4a21-92ef-d28b72d3033b&country=" . $_REQUEST['country'] ."&year=2022";


	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	$count = count($decode['holidays']);
	$arr = [];

	for ($x = 0; $x < $count; $x++){
		$temp = null;
		$temp['name'] = $decode['holidays'][$x]['name'];
		$temp['date'] = $decode['holidays'][$x]['date'];
		array_push($arr, $temp);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $arr;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>