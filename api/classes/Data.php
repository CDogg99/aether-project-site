<?php

    class Data{

        public $id = null;
        public $latitude = null;
        public $longitude = null;
        public $unixTime = null;
        public $creation = null;
        public $source = null;

        public $dbConn = null;

        function retrieve(){
            return $this->checkForUpdate();
            $sql = "SELECT * FROM data ORDER BY id DESC";
            $result = $this->dbConn->query($sql);
            $array = array();
            while($r = $result->fetch_assoc()){
                $array[] = $r;
            }
            return $array;
        }

        function checkForUpdate(){
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            if($result->num_rows == 0){
                $sql = "INSERT INTO sources (id) VALUES ('spottrace');INSERT INTO sources (id) VALUES ('aprs');";
                $this->dbConn->query($sql);
            }
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            $array = [];
            while($row = $result->fetch_assoc()){
                $array[] = $row;
            }
            foreach($array as $value){
                return $value["id"];
                switch($value["id"]){
                    case 'spottrace':
                        break;
                    case 'aprs':
                        break;
                }
            }
        }

        function pullSpotTraceData(){
            $data = file_get_contents('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/1aHCJxvC2zDtW2JabdY7coIjy4VbsxY8r/message.json?feedPassword=megatron');
            $data = json_decode($data);
            if(isset($data->response->errors)){
                return;
            }
            $response = $data->response->feedMessageResponse;
            $messages = $response->messages->message;
            for($i = 0; $i < sizeof($messages); $i++){
                $sql = "INSERT IGNORE INTO data (id, latitude, longitude, unixTime, creation, source)
                VALUES ({$messages[$i]->id}, {$messages[$i]->latitude}, {$messages[$i]->longitude}, {$messages[$i]->unixTime}, NOW(), 'spottrace')";
                $result = $this->dbConn->query($sql);
            }
        }

    }

?>
