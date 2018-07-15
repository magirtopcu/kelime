var wordApp = angular.module('WordApp', ['chieffancypants.loadingBar']);
 
wordApp.controller('WordListController', function ($scope,$http,cfpLoadingBar) {
	
	
  	cfpLoadingBar.start();
	 var words =localStorage.getItem("words");
	 var settings = JSON.parse(localStorage.getItem('settings'));
	 if(!settings){
	 	settings = {shuffled : false};
	 	localStorage.setItem("settings", JSON.stringify(settings));
	 }
	 
	 var  shuffle=function(a){
		    var j, x, i;
		    for (i = a.length - 1; i > 0; i--) {
		        j = Math.floor(Math.random() * (i + 1));
		        x = a[i];
		        a[i] = a[j];
		        a[j] = x;
		    }
		    return a;
		}

	 var getWordsFromSource=function(){
	 	$http.get('word.json').success(function(data) {
	 		if(settings.shuffled){
	 			data = shuffle(data);
	 		}
	 			
                for(var i=0;i<data.length;i++){
                        
                        data[i].selected=0;
                         data[i].id="_id"+i;
                        }
                
    		$scope.words = data;
			save();
			clearInterval(s);
			cfpLoadingBar.complete();
	
			});
  		  	var s =setInterval(function(){
  				cfpLoadingBar.inc();		
  		  	},200);
	 };
	 
	 var save = function(){
	  setTimeout(function(){
	  	localStorage.setItem("words",JSON.stringify($scope.words));
	  },0);
		
	 };
	 
	 if(words==null){
		 	getWordsFromSource();
  		}
	else{
		try{

			words  = JSON.parse(words);
			
			if(settings.shuffled){
				words = shuffle(words);
			}

			$scope.words= words;
			cfpLoadingBar.complete();
		}
		catch(e){
			cfpLoadingBar.start();
			localStorage.clear();
			getWordsFromSource();
		}
		
	}
	  $scope.details={};
	  $scope.showMeanings=true;
	  $scope.shuffledList=settings.shuffled;

	  $scope.pageSize=10;
	  $scope.markWordAsRead=function(){
	  	
		  this.word.selected=!this.word.selected;
		  save();
	
	  };
	  
	  $scope.stopPropagation = function(e) {
	      // to make sure it is a checkbox
	      if (angular.element(e.currentTarget).prop('tagName') === 'INPUT') {
	          e.stopPropagation();
	      }
	  };
	  
	  $scope.more = function(){
	  	  $scope.pageSize+=10;
		 
	  };
	  $scope.toggleShuffle = function(){
	  	  settings.shuffled = $scope.shuffledList;
	  	  localStorage.setItem("settings",JSON.stringify(settings));
	  	  location.reload();
	  }
	  
	  
		 window.jsonp_data=function(arg){
			 var arr=[]; 
			 for(var i=0;i<arg.tuc.length;i++){
			 	 var p =arg.tuc[i].phrase;
				 var m=arg.tuc[i].meanings;
				 if(!p){console.log(arg.tuc[i]);}
				 arr.push({phrase:p, meanings:m});
			 }
			 $scope.details[window.currentWordId]={service :arr,show:true};
			 
		 };
		 
		  $scope.clear=function(){ 
			  var a = confirm("Are you sure ?");
		   	if(a==true){
		 	   localStorage.clear(); 
			  alert("please refresh page");}
		  }; 
		 
		 var url="https://glosbe.com/gapi/translate?from=en&dest=tr&format=json&pretty=false&callback=jsonp_data&phrase="; 
		 $scope.lookFor=function(word,e){
			  e.stopPropagation();
			  if($scope.details[word.id]){
			  	$scope.details[word.id].show=true;
				return;
			  }
			 window.currentWordId=word.id;
				    var a =$http({method: "JSONP", url: url+word.word.toLowerCase(),responseType:"text"}).
				       success(function(data, status) {
						  
				       }).
				       error(function(data, status) {
						   
				     });
					
				};
				
				
				
				$scope.hide_detail=function(e,id){
					if(e)
					 {e.stopPropagation();}
					$scope.details[id].show=false;
					
				};
				
				
});