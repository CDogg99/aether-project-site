<?php

    class Sources{

        //Sources table properties
        public $id = null;
        public $lastUpdate = null;

        //Connections
        public $dbConn = null;

        function checkForUpdate(){
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            if($result->num_rows == 0){
                $sql = "INSERT INTO sources (id) VALUES ('spottrace');";
                $sql .= "INSERT INTO sources (id) VALUES ('aprs');";
                $this->dbConn->multi_query($sql);
            }
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            if(!$result){
                return;
            }
            $array = [];
            while($row = $result->fetch_assoc()){
                $array[] = $row;
            }
            $data = new Data();
            $data->dbConn = $this->dbConn;
            foreach($array as $value){
                switch($value["id"]){
                    case 'spottrace':
                        if($value["lastUpdate"]==null){
                            $data->pullSpotTraceData();
                            $sql = "UPDATE sources SET lastUpdate=NOW() WHERE id='spottrace'";
                            $this->dbConn->query($sql);
                        }
                        else{
                            $timestamp = strtotime($value["lastUpdate"]);
                            $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                            $currentTime = new DateTime(date("Y-m-d H:i:s"));
                            $diff = $datetimeOfRecent->diff($currentTime);
                            if($diff->i >= 3){
                                $data->pullSpotTraceData();
                                $sql = "UPDATE sources SET lastUpdate=NOW() WHERE id='spottrace'";
                                $this->dbConn->query($sql);
                            }
                        }
                        break;
                    case 'aprs':
                        if($value["lastUpdate"]==null){
                            $data->pullAPRSData();
                            $sql = "UPDATE sources SET lastUpdate=NOW() WHERE id='aprs'";
                            $this->dbConn->query($sql);
                        }
                        else{
                            $timestamp = strtotime($value["lastUpdate"]);
                            $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                            $currentTime = new DateTime(date("Y-m-d H:i:s"));
                            $diff = $datetimeOfRecent->diff($currentTime);
                            if($diff->i >= 3){
                                $data->pullAPRSData();
                                $sql = "UPDATE sources SET lastUpdate=NOW() WHERE id='aprs'";
                                $this->dbConn->query($sql);
                            }
                        }
                        break;
                }
            }
        }

    }

?>