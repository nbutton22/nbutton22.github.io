function request(config, callback) {

if(window.XMLHttpRequest)
{
	xhttp = new XMLHttpRequest();
}
else
{
	xhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

xhttp.onreadystatechange=function()
{
	if (xhttp.readyState==4 && xhttp.status==200)
	{
		var strResult = xhttp.responseText
		var jsonResult = JSON.parse(strResult)
		callback(jsonResult)
	}
	else if(xhttp.readyState < 4)
	{
		 //do nothing
	}
}


var str = "?value=" + config.valueField + "&unit=" + config.valueUnit + "&label=" + config.groupBy + "&table=" + config.dataset
	
config.baseFilters.forEach(function (d, i) {
	str += "&field" + i + "=" + d.field + "&sign" + i + "=" + d.expression.type + "&val" + i + "=" + d.expression.value
})

str += "&order=" + config.order

var linktoexecute = "http://192.255.34.29/test.php" + str;
xhttp.open("GET",linktoexecute,true);
xhttp.send();

}