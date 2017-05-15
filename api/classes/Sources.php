<?php

    class Sources{

        //Connections
        public $twitterConn = null;
        public $dbConn = null;

        function checkForUpdate(){
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            if($result->num_rows == 0){
                $sql = "INSERT INTO sources (id) VALUES ('spottrace');";
                $sql .= "INSERT INTO sources (id) VALUES ('aprs');";
                $sql .= "INSERT INTO sources (id) VALUES ('twitter');";
                $this->dbConn->multi_query($sql);
            }
            $sql = "SELECT * FROM sources";
            $result = $this->dbConn->query($sql);
            //Check for error
            if(!$result){
                return;
            }
            $array = array();
            while($row = $result->fetch_assoc()){
                $array[] = $row;
            }
            $data = new Data();
            $data->dbConn = $this->dbConn;
            foreach($array as $value){
                switch($value["id"]){
                    case 'spottrace':
                        if($value["last_update"]==null){
                            $data->pullSpotTraceData();
                            $sql = "UPDATE sources SET last_update=NOW() WHERE id='spottrace'";
                            $this->dbConn->query($sql);
                        }
                        else{
                            $timestamp = strtotime($value["last_update"]);
                            $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                            $currentTime = new DateTime(date("Y-m-d H:i:s"));
                            $diff = $datetimeOfRecent->diff($currentTime);
                            if($diff->i >= 3){
                                $data->pullSpotTraceData();
                                $sql = "UPDATE sources SET last_update=NOW() WHERE id='spottrace'";
                                $this->dbConn->query($sql);
                            }
                        }
                        break;
                    case 'aprs':
                        if($value["last_update"]==null){
                            $data->pullAPRSData();
                            $sql = "UPDATE sources SET last_update=NOW() WHERE id='aprs'";
                            $this->dbConn->query($sql);
                        }
                        else{
                            $timestamp = strtotime($value["last_update"]);
                            $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                            $currentTime = new DateTime(date("Y-m-d H:i:s"));
                            $diff = $datetimeOfRecent->diff($currentTime);
                            if($diff->i >= 3){
                                $data->pullAPRSData();
                                $sql = "UPDATE sources SET last_update=NOW() WHERE id='aprs'";
                                $this->dbConn->query($sql);
                            }
                        }
                        break;
                    case 'twitter':
                        $tweets = new Tweets();
                        $tweets->twitterConn = $this->twitterConn;
                        $tweets->dbConn = $this->dbConn;
                        if($value["last_update"]==null){
                            $tweets->saveRecentTweet();
                            $sql = "UPDATE sources SET last_update=NOW() WHERE id='twitter'";
                            $this->dbConn->query($sql);
                        }
                        else{
                            $timestamp = strtotime($value["last_update"]);
                            $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                            $currentTime = new DateTime(date("Y-m-d H:i:s"));
                            $diff = $datetimeOfRecent->diff($currentTime);
                            if($diff->i >= 3){
                                $tweets->saveRecentTweet();
                                $sql = "UPDATE sources SET last_update=NOW() WHERE id='twitter'";
                                $this->dbConn->query($sql);
                            }
                        }
                        break;
                }
            }
        }

    }

?>