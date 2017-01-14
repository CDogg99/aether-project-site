<?php
    use \Psr\Http\Message\ServerRequestInterface as Request;
    use \Psr\Http\Message\ResponseInterface as Response;
    use Abraham\TwitterOAuth\TwitterOAuth;

    require 'libs/vendor/autoload.php';

    //Load class files
    require("classes/Tweets.php");

    $config['displayErrorDetails'] = true;
    $config['addContentLengthHeader'] = false;

    $config['db']['server'] = "localhost";
    $config['db']['username'] = "root";
    $config['db']['password'] = "";
    $config['db']['dbname'] = "aether";

    $config['twitter']['consumer_key'] = "";
    $config['twitter']['consumer_secret'] = "";
    $config['twitter']['access_token'] = "";
    $config['twitter']['access_token_secret'] = "";

    $app = new \Slim\App(["settings" => $config]);

    $container = $app->getContainer();
    $container["twitter"] = function ($c) {
        $twitter = $c["settings"]["twitter"];
        $connection = new TwitterOAuth($twitter["consumer_key"], $twitter["consumer_secret"], $twitter["access_token"], $twitter["access_token_secret"]);
        $content = $connection->get("account/verify_credentials");
        if(isset($content->errors[0]->code)){
            if($content->errors[0]->code == 89){
                return "Failed to connect to Twitter API.";
            }
        }
        return $connection;
    };
    $container["db"] = function ($c) {
       $db = $c["settings"]["db"];
       $connection = new mysqli($db["server"],$db["username"],$db["password"]) or die("Failed to connect to the server.");
       mysqli_select_db($connection,$db["dbname"]) or die("Failed to connect to the database.");
       return $connection;
   };

    //Tweets endpoints
    //POST
    $app->post('/tweets',function(Request $request, Response $response){
        $conn = $this->twitter;
        if($conn == "Failed to connect to Twitter API."){
            $response->getBody()->write(json_encode($conn));
            return $response;
        }
        $data = $request->getParsedBody();
        if(!isset($data["body"])){
            $response->getBody()->write(json_encode("Missing body input."));
            return $response;
        }
        $tweet = new Tweets();
        $tweet->body = $data["body"];
        $tweet->twitterConn = $conn;
        $tweet->dbConn = $this->db;
        $response->getBody()->write($tweet->create());
        return $response;
    });

    $app->run();
?>
