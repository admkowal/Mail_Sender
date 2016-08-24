(function(){

	var form = document.querySelector("form"),
		infoAlert = document.querySelector("#displayInfo");

	function displayInfo(style, info) {

		infoAlert.classList.add(style);
		infoAlert.innerHTML = info;

  	}

  	function sendForm(e) {

  		e.preventDefault();

  		var fields = form.querySelectorAll("input, textarea"),
  			data = {};

  		//method borrowing
  		Array.prototype.forEach.call(fields, function(field) {
  			data[field.name] = field.value;
  		});

  		AJAX({

  			type: form.getAttribute("method"),
  			url: form.getAttribute("action"),
  			data: data,
  			success: function(response, status, xhr) {

  				var res = JSON.parse(response);

  				if(Array.isArray(res)){
  					displayInfo("alert-warning", res.join("<br>"));
  				} else if("success" in res) {
  					displayInfo("alert-success", res.success);
  					form.removeEventListener("submit", sendForm, false);
  					form.querySelector("button").setAttribute("disabled", "disabled");
  				}

  			}

  		});

  	}

  	form.addEventListener("submit", sendForm, false);

})();