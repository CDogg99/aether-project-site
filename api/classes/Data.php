<?php

    class Data{

        //Connections
        public $dbConn = null;

        function retrieve($toRetrieve){
            //Check if enough time has passed to pull from APIs again
            $sources = new Sources();
            $sources->dbConn = $this->dbConn;
            $sources->checkForUpdate();

            if($toRetrieve == "location"){
                //Get SpotTrace location data from db
                $sql = "SELECT * FROM spottrace_location_data ORDER BY unix_time DESC";
                $result = $this->dbConn->query($sql);
                if(!$result){
                    return;
                }
                $spottraceArray = array();
                while($r = $result->fetch_assoc()){
                    $spottraceArray[] = $r;
                }

                //Get APRS location data from db
                $sql = "SELECT * FROM aprs_location_data ORDER BY unix_time DESC";
                $result = $this->dbConn->query($sql);
                if(!$result){
                    return;
                }
                $aprsArray = array();
                while($r = $result->fetch_assoc()){
                    $aprsArray[] = $r;
                }

                //Merge arrays
                $mergedArray = array_merge($spottraceArray, $aprsArray);

                //Sort merged array by unix timestamp
                function compare($a, $b){
                    return strcmp($b["unix_time"], $a["unix_time"]);
                }
                usort($mergedArray, "compare");

                return $mergedArray;
            }
            else if($toRetrieve == "weather"){
                //Get APRS weather data from db
                $sql = "SELECT * FROM aprs_weather_data ORDER BY unix_time DESC";
                $result = $this->dbConn->query($sql);
                if(!$result){
                    return;
                }
                $aprsArray = array();
                while($r = $result->fetch_assoc()){
                    $aprsArray[] = $r;
                }
                return $aprsArray;
            }
        }

        function pullSpotTraceData(){
            $data = file_get_contents('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/1aHCJxvC2zDtW2JabdY7coIjy4VbsxY8r/message.json?feedPassword=megatron');
            //Testing purposes
            //$data = file_get_contents("tmp/spottrace.json");
            $data = json_decode($data);
            if(isset($data->response->errors)){
                return;
            }
            $response = $data->response->feedMessageResponse;
            $messages = $response->messages->message;
            for($i = 0; $i < sizeof($messages); $i++){
                $sql = "INSERT IGNORE INTO spottrace_location_data (unix_time, latitude, longitude, creation)
                VALUES ('{$messages[$i]->unixTime}', '{$messages[$i]->latitude}', '{$messages[$i]->longitude}', NOW())";
                $this->dbConn->query($sql);
            }
        }

        function pullAPRSData(){
            //Pull location data
            $data = file_get_contents('https://api.aprs.fi/api/get?name=KG5SUA&what=loc&apikey=99821.h3iiSoUWZxDLvZz&format=json');
            //Testing purposes
            //$data = file_get_contents("tmp/aprs_loc.json");
            $data = json_decode($data);
            if($data->result == "fail"){
                return json_encode("Failure");
            }
            $entries = $data->entries;
            for($i = 0; $i < sizeof($entries); $i++){
                $sql = "INSERT IGNORE INTO aprs_location_data (unix_time, latitude, longitude, altitude, creation)
                VALUES ('{$entries[$i]->time}', '{$entries[$i]->lat}', '{$entries[$i]->lng}', '{$entries[$i]->altitude}', NOW())";
                $this->dbConn->query($sql);
            }

            //Pull weather data
            $data = file_get_contents('https://api.aprs.fi/api/get?name=KG5SUA&what=wx&apikey=99821.h3iiSoUWZxDLvZz&format=json');
            //Testing purposes
            //$data = file_get_contents("tmp/aprs_wx.json");
            $data = json_decode($data);
            if($data->result == "fail"){
                return json_encode("Failure");
            }
            $entries = $data->entries;
            for($i = 0; $i < sizeof($entries); $i++){
                $sql = "INSERT IGNORE INTO aprs_weather_data (unix_time, temperature, pressure, creation)
                VALUES ('{$entries[$i]->time}', '{$entries[$i]->temp}', '{$entries[$i]->pressure}', NOW())";
                $this->dbConn->query($sql);
            }
        }

    }

?>
