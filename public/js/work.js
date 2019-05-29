$(document).ready(function() {
	$(".alert").delay(4000).slideUp(200, function() {
		$(this).alert('close');
	});


	$("#frmsubmit").click(function () {
		var password = $("#password").val();
		var confirmPassword = $("#password_conf").val();
		if (password != confirmPassword) {
			alert("Passwords do not match.");
			return false;
		}
		return true;
	});

});