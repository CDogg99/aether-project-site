<?php

    class Data{

        public $id = null;
        public $latitude = null;
        public $longitude = null;
        public $source = null;

        public $dbConn = null;

        function retrieve(){
            $this->pullSpotTraceData();
            $sql = "SELECT * FROM data";
            $result = $this->dbConn->query($sql);
            $array = array();
            while($r = $result->fetch_assoc()){
                $array[] = $r;
            }
            return $array;
        }

        function pullSpotTraceData(){
            //https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/1aHCJxvC2zDtW2JabdY7coIjy4VbsxY8r/message.json?feedPassword=megatron
            $sql = "SELECT * FROM data";
            $result = $this->dbConn->query($sql);
            if($result->num_rows == 0){
                $data = file_get_contents('');
                $data = json_decode($data);
                return $data[0][1];
            }
            else{

            }
        }

    }

?>
