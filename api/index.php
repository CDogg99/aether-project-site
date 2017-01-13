<?php
    use \Psr\Http\Message\ServerRequestInterface as Request;
    use \Psr\Http\Message\ResponseInterface as Response;

    require 'libs/vendor/autoload.php';

    //Load class files
    spl_autoload_register(function($classname){
        require ("classes/" . $classname . ".php");
    });

    $config['displayErrorDetails'] = true;
    $config['addContentLengthHeader'] = false;

    $app = new \Slim\App(["settings" => $config]);

    //Tweet endpoints
    //POST
    $app->post('/tweet',function(Request $request, Response $response){
        $data = $request->getParsedBody();
        $tweet = new Tweet();
        $response->getBody()->write($tweet->create());
        return $response;
    });

    $app->run();
?>
