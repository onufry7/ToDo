<?php

// Sprawdzamy czy wykonano akcje
if(isset($_POST['action']))
{

	//  Sprawdzamy jaka akcja
	switch ($_POST['action']) 
	{
		case 'add':
			
			$json['date'] = htmlspecialchars($_POST['date']);
			$json['description'] = htmlspecialchars($_POST['description']);

			// Zapis danych do pliku
			if(file_exists('db.json'))
			{
				$currentData = file_get_contents('db.json');
				$tmpArray = json_decode($currentData, true);
				array_push($tmpArray, $json);
				$tmpArray = json_encode($tmpArray, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
				file_put_contents('db.json', $tmpArray);
				print_r($json); // Zwrócenie danych
			}
			break;


		case 'delete':

			$date = htmlspecialchars($_POST['date']);
			$description = htmlspecialchars($_POST['description']);	

			// Usówanie danych z pliku
			if(file_exists('db.json'))
			{
				$currentData = file_get_contents('db.json');
				$tmpArray = json_decode($currentData, true);

				// Szukamy wpisu do usunięciaa
				foreach ($tmpArray as $key => $value) 
				{
					if( in_array($date, $value) && in_array($description, $value) )
					{
						unset($tmpArray[$key]);
					}
				}

				// Zapisujemy przetworzone dane
				$tmpArray = json_encode(array_values($tmpArray), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
				file_put_contents('db.json', $tmpArray);
				echo 'true';
			}
			break;
	}
}

?>