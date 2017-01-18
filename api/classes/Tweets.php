<?php

    class Tweets{

        public $id_str = null;
        public $body = null;
        public $creation = null;

        public $twitterConn = null;
        public $dbConn = null;

        function create(){
            $status = $this->twitterConn->post("statuses/update", ["status" => $this->body]);
            if(isset($status->errors[0]->code)){
                if($status->errors[0]->code == 187){
                    return json_encode($status->errors[0]->message);
                }
                else if($status->errors[0]->code == 170){
                    return json_encode("Body input empty.");
                }
                else{
                    return json_encode("An unknown error has occurred.");
                }
            }
            $this->id_str = $status->id;
            $this->insertTweet();
            return json_encode($status);
        }

        function checkForUpdate(){
            $sql = "SELECT * FROM tweets ORDER BY creation DESC";
            $result = $this->dbConn->query($sql);
            if($result->num_rows == 0){
                //Placeholder
                $this->body = "Hello";
                return $this->create();
            }
            else{
                $timestamp = strtotime($result->fetch_assoc()["creation"]);
                $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                $currentTime = new DateTime(date("Y-m-d H:i:s"));
                $diff = $datetimeOfRecent->diff($currentTime);
                //Adjust times accordingly later
                if($diff->i >= 3){
                    //Placeholder
                    $this->body = "Hello3";
                    return $this->create();
                }
                else if($diff->i == 2 && $diff->s >= 30){
                    //Placeholder
                    $this->body = "Hello4";
                    return $this->create();
                }
                else{
                    return json_encode("Update not yet ready. Time since last update: " . $diff->i . " min " . $diff->s . " sec.");
                }
            }
        }

        function insertTweet(){
            $this->body = mysqli_real_escape_string($this->dbConn, $this->body);
            $sql = "INSERT INTO tweets(id,body,creation) VALUES('$this->id_str','$this->body',NOW())";
            $this->dbConn->query($sql);
        }

    }

?>
