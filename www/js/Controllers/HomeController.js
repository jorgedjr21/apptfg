app.controller('HomeController',function($scope,$http,$ionicPlatform,$httpParamSerializerJQLike,$cordovaDeviceMotion,$interval){
  // 2c59xjkymlRJT7VvJvmEt4oOzBLcIwItAuHpyn5At2zJEyGN5ThKptQeSb2I
  //eZBB1Bd4Nx1VPdQydV7aPzCM3OJjMDwegQK6VRGgJsL5QWFCNYu8ewOZCAte DEVICEKEY
    $ionicPlatform.ready(function(){
      $scope.x = 0;
      $scope.y = 0;
      $scope.z = 0;
      $scope.envio = false
      var flashlight = false;
      var avaiflash = 0;
      var chaveusuario = 'QZPPP4Fbl5JKiZCnt5Cf3UpkkyXd38pMZhyopJzyf5gYZwcSV70r8x1cgfyw' ;
      var chavedevice = 'z4o1T4Yk6aQ441mZhm5w4Tm1h8Hur9FK5uRGU5tWNxFzyLAKYspv5qEQqlFH';


      $scope.enviar = function(){
        var json = JSON.stringify({'x':2,'y':3,'z':4,'flashlight':avaiflash});
        var dados = {data:json};


        $http({method:'post',headers:{'Content-Type':'application/x-www-form-urlencoded;charset:UTF-8;'},url:'http://tfg.jorgejunior.xyz/api/devices/'+chaveusuario+'/'+chavedevice+'/streams',data:$httpParamSerializerJQLike(dados)})
        .then(function(response){
            $scope.envio = true;
        },function(error){
          $scope.envio = false;
        });

      }

      if(window.cordova){
        getCloudData();
        $interval(getCloudData,200);

        $scope.lanterna = function(){

            window.plugins.flashlight.available(function(isAvaible){
              if(isAvaible){
                window.plugins.flashlight.toggle(function(){console.log('ligou/desligou')});
              }else{
                console.log('Não Disponível');
              }

              flashlight = window.plugins.flashlight.isSwitchedOn();
              if(flashlight){
                avaiflash = 1;
              }else{
                avaiflash = 0 ;
              }
            });

            $cordovaDeviceMotion.getCurrentAcceleration().then(acelSuccess,acelError);
        }

        var options = {frequency:5000};
        function acelSuccess(result){
          var json = JSON.stringify({'x':result.x.toFixed(4),'y':result.y.toFixed(4),'z':result.z.toFixed(4),'flashlight':avaiflash})
          var dados = {data:json};
          //var dados = {data:'abcde'};
          $scope.x = result.x.toFixed(4);
          $scope.y = result.y.toFixed(4);
          $scope.z  = result.z.toFixed(4);
          $http({method:'post',headers:{'Content-Type':'application/x-www-form-urlencoded;charset:UTF-8;'},url:'http://tfg.jorgejunior.xyz/api/devices/'+chaveusuario+'/'+chavedevice+'/streams',data:$httpParamSerializerJQLike(dados)})
          .then(function(response){
            $scope.envio = true;
          },function(error){
            $scope.envio = false;
          });
        };

        function acelError(error){
          console.log(error);
        }

        var watch = $cordovaDeviceMotion.watchAcceleration(options);
        watch.then(
          null,
          acelError,
          acelSuccess);

      function getCloudData(){
          $http({method:'get',url:'http://tfg.jorgejunior.xyz/api/devices/'+chaveusuario+'/'+chavedevice+'/streams/last'}).then(function(response){

              var json = JSON.parse(response.data.stream.data);
              var cloudflash =  avaiflash = json.flashlight;
              var cellflash = window.plugins.flashlight.isSwitchedOn();

              if(cellflash != cloudflash){
                window.plugins.flashlight.available(function(isAvaible){
                  if(isAvaible){
                    window.plugins.flashlight.toggle();
                  }else{
                    console.log('Não Disponível');
                  }
                });
              }

              if(cloudflash == 0 ){
                $scope.flashbutton = "Ligar Lanterna";
              }else{
                $scope.flashbutton = "Desligar lanterna";
              }
          });
        }
      }
    });
});
