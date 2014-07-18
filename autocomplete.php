<head>
  <meta charset="utf-8">
  <title>jQuery UI Autocomplete - Custom data and display</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
  <script src="//code.jquery.com/ui/1.11.0/jquery-ui.js"></script>
  <link rel="stylesheet" href="/resources/demos/style.css">
  <style>
  #project-label {
    display: block;
    font-weight: bold;
    margin-bottom: 1em;
  }
  #project-icon {
    float: left;
    height: 32px;
    width: 32px;
  }
  #project-description {
    margin: 0;
    padding: 0;
  }
  </style>
  <script>

  var productList = [];

  $(function() {
    var e5Data = "http://e5webservices.onthehub.com/data/v1/institutions/46817193-1960-4ce3-925c-8556e8dc7b93/webstores?callback=?";

    $.getJSON( e5Data, null, function(products) {

      for(i=0;i < products[0].ProductMajorVersions.length; i++){
        productList.push({  "label": products[0].ProductMajorVersions[i].ProductMajorVersionName,
                  "desc": products[0].ProductMajorVersions[i].ProducerOrganizationName,
                  "prodHref": products[0].ProductMajorVersions[i].OfferingListUrl});
      }
    });
 
    $( "#project" ).autocomplete({
      minLength: 1,
      source: productList,
      select: function( event, ui ) {
        window.location.href = ui.item.prodHref;
        return false;
      },
      focus: function( event, ui ) {
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a href='" + item.prodHref + "?srch=" + item.label + "'><div id='resultTitle'>" + item.label + "</div><div id='resultByline'>" + item.desc + "</div></a>" )
        .appendTo( ul );
    };
  });
  </script>
  <style>
    .ui-autocomplete{
      width: 225px;
      max-height:300px;
      overflow-y:scroll;
      overflow-x:hidden;
    }
    .ui-menu .ui-menu-item{
      padding: 10px 10px 10px 10px;
    }
    .ui-menu-item a{
      text-decoration: none;
    }
    .ui-menu-item #resultTitle{
      font-size: 10pt;
      font-weight: bold;
    }
    .ui-menu-item #resultByline{
      font-size: 8pt;
      color: #949494;
    }
    .ui-state-focus{
      background: #0F699E !important;
    }
    .ui-autocomplete .ui-state-focus div{
      color: #ffffff !important;
    }

  </style>

</head>
<body>
<form onsubmit="alert('Hello');">
  <input style="width:230px;" id="project" >
</form>
 
</body>