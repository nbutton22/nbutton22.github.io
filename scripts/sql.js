function sqlFetch(config) {

var connection = new ActiveXObject("ADODB.Connection") ;



function getQueryString(config) {
	var query = ""
	query = query + "SELECT " + config.valueField + " AS Value, "
	query = query + config.valueUnit + " AS Unit, "
	query = query + config.groupBy + " AS Label "

	query = query + "FROM " + config.dataset + " "
	
	query = query + "WHERE "
	config.baseFilters.forEach(function (filter, ndx) {
			if (ndx != 0) {
				query = query + " AND "
			}
			query = query + filter.field + filter.expression.type + "'" + filter.expression.value + "'"
		})
	
	query = query + " ORDER BY " + config.order + " ASC"



	return query
}

var connectionstring="Data Source=<server>;Initial Catalog=<catalog>;User ID=<user>;Password=<password>;Provider=SQLOLEDB";
connectionstring = "Data Source=INTERNPROG;Initial Catalog=NCCD_OPENDATACACHE_DOH_DATA;User ID=Reader;Password=password;Provider=SQLOLEDB"
connection.Open(connectionstring);
var rs = new ActiveXObject("ADODB.Recordset");

rs.Open(getQueryString(config), connection);
rs.MoveFirst()
var result = [];
while(!rs.eof)
{

   var val = rs("Value")
   var lab = rs("Label")
   var un = rs("Unit")

   var payload = {
	   value: String(val),
	   label: String(lab),
	   unit: String(un)
   }
   
   result.push(payload)
   rs.MoveNext()
}

rs.close;
connection.close;
return result
}