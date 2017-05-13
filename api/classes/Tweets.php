<?php

    class Tweets{

        //Connections
        public $twitterConn = null;
        public $dbConn = null;

        function getRecentTweet(){
            $sql = "SELECT * FROM tweets ORDER BY creation DESC";
            $result = $this->dbConn->query($sql);
            if($result->num_rows > 0){
                $timestamp = strtotime($result->fetch_assoc()["creation"]);
                $datetimeOfRecent = new DateTime(date("Y-m-d H:i:s",$timestamp));
                $currentTime = new DateTime(date("Y-m-d H:i:s"));
                $diff = $datetimeOfRecent->diff($currentTime);
                if($diff->i >= 2){
                    $this->saveRecentTweet();
                }
            }
            else{
                $this->saveRecentTweet();
            }
            $sql = "SELECT * FROM tweets ORDER BY id DESC";
            $result = $this->dbConn->query($sql);
            return $result->fetch_assoc();
        }

        function saveRecentTweet(){
                $response = $this->twitterConn->get("statuses/home_timeline", ["count" => 1, "exclude_replies" => true]);
                $tweet = $response[0];
                //Tweet has images/video
                if(isset($tweet->entities->media)){
                    $mediaLinks = array();
                    $media = $tweet->extended_entities->media;
                    for($i = 0; $i < sizeof($media); $i++){
                        $mediaLinks[] = $media[$i]->media_url;
                    }
                    $mediaLinks = json_encode($mediaLinks);
                    $sql = "INSERT IGNORE INTO tweets (id, body, media, creation) 
                    VALUES ('{$tweet->id_str}', '{$tweet->text}', '{$mediaLinks}', NOW())";
                    $this->dbConn->query($sql);
                }
                //Tweet has no images/video
                else{
                    $sql = "INSERT IGNORE INTO tweets (id, body, creation)
                    VALUES ('{$tweet->id_str}', '{$tweet->text}', NOW())";
                    $this->dbConn->query($sql);
                }
        }

    }

?>
