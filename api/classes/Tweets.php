<?php

    class Tweets{

        public $id_str = null;
        public $body = null;

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

        function insertTweet(){
            $this->body = mysqli_real_escape_string($this->dbConn, $this->body);
            $sql = "INSERT INTO tweets(id,body) VALUES('$this->id_str','$this->body')";
            $this->dbConn->query($sql);
        }

    }

?>
