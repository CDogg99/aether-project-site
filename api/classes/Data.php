<?php

    class Data{

        public $id = null;
        public $latitude = null;
        public $longitude = null;
        public $source = null;

        public $dbConn = null;

        function retrieve(){
            $sql = "SELECT * FROM data";
            $result = $this->dbConn->query($sql);
            $array = array();
            while($r = $result->fetch_assoc()){
                $array[] = $r;
            }
            return $array;
        }
    }

?>
