<!DOCTYPE HTML>
<html>
	<body>
<?php 
	
	//Connect to the Database
	 $conn = mysqli_connect("localhost","don't know","DK","DK");
		if (!$conn){	//can't connect error}


	$email=$_POST['email'];
	$username=$_POST['user'];
	$password=$_POST['pass'];
	
	//Check if the user already exists in the DB
	$sql = "SELECT * FROM Customer WHERE custName='".$username."'";
	
	$result=mysqli_query($conn, $sql);
	if (!$result) {
   		printf("Error: %s\n", mysqli_error($conn));
		exit();
	}
	$row=mysqli_fetch_array($result);
	if ($row) {
		//We found the user
		echo "Username taken<BR>";
		
	} else {
 		//We did not find the user so we will create it
		//echo "Creating user<BR>";
		
 	}
	
	//Close the DB
	mysqli_close($conn)
?>
	</body>
</html>
