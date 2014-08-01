var productList = [];
var searchBarID = "#ctl00_txtProductSearchName"; // ID name of search bar autocomplete is to use.

//Function for Returning all required data from JSON calls, including IP, Country code and available products.
function getAllJSON()
{
  var ipData = "http://jsonip.com/?callback=?"; //Returns Users IP Address from jsonip.com. Free and apparently unlimited.
  var ipAdd; //Variable to save the IP Address to.

  //Performs JSONP request to return IP address and; if one is found, saves it to the variable.
  $.getJSON( ipData, function(address){
    if(address.ip)
      ipAdd = address.ip;
  })

  //Function calls after previous is complete. Requires IP address from previous.
  .done(function(){
    var countryData = "http://e5webservices.onthehub.com/data/v2/usercountry?userip=" + ipAdd +"&callback=?"; //Country Code data from IP address.
    var userCountry; // Variable to save Country Code to.

    //Performs JSONP request to return Country code, and if a valid one is found, saves it to the variable. Otherwise returns US.
    $.getJSON( countryData, function(country){
      if(country && country !== "--")
        userCountry = country;
      else
        userCountry = "US";
    })

    //Function calls after previous is complete. Requires Country code from previous.
    .done(function(){
      var e5Data = "http://e5webservices.onthehub.com/data/v2/institutions/46817193-1960-4ce3-925c-8556e8dc7b93/webstores?countryCode=" + userCountry +"&callback=?" //Product Data based on current country.

      //Parses JSON API data into local array for autocomplete access and speed.
      $.getJSON( e5Data, function(products) {

        for(i=0;i < products[0].ProductMajorVersions.length; i++){
          productList.push({  "label": products[0].ProductMajorVersions[i].ProductMajorVersionName,
                              "desc": products[0].ProductMajorVersions[i].ProducerOrganizationName,
                              "prodHref": products[0].ProductMajorVersions[i].OfferingListUrl
          });
        }
      });
    });
  });
}
  
$(function() {

  //Initial call to retrieve data
  getAllJSON();

  //JQuery Autocomplete code
  $( searchBarID ).autocomplete({
    minLength: 1, //Minimum number of characters before autocomplete returns. Stops all products from listing.
    source: productList,
    select: function( event, ui ) { //Determines what happens when hitting enter on highlighted list option
      window.location.href = ui.item.prodHref;
      return false;
    },
    focus: function( event, ui ) { //Determines what happens when a list item is in focus. Set to nothing.
      return false;
    }
  })
  .data("ui-autocomplete")._renderItem = function( ul, item ) { //JQuery Autocomplete code. Renders the suggested list of products.    
    ul.addClass("smartSearch");//Adds class to smartSearch to differentiate Styling
    return $( "<li class='smartSearchResult'>" )
    .data("ui-autocomplete-item", item)
    .append("<a href='" + item.prodHref + "&srch=" + item.label + "'><div class='resultWrap'><div id='resultTitle'>" + item.label + "</div><div id='resultByline'>" + item.desc + "</div></div></a>" )
    .appendTo( ul );
  };
  $(".ui-autocomplete").removeClass("ui-corner-all");//Removes rounded corners that jQuery adds by default
});

//Adds CSS styles for Smart Search
var smartStyle = document.createElement('style');
smartStyle.type = 'text/css';
head = document.getElementsByTagName('head')[0];

//Smart Search Styles
var styles = ".smartSearch{ border: 2px solid #efefef; border-top: none; padding-left:2px; width: 215px; max-height:300px; overflow-y:scroll; overflow-x:hidden;} .smartSearch .ui-menu-item a {padding:0; line-height: initial} .smartSearch .smartSearchResult { padding: 0 ;} .smartSearch .smartSearchResult .resultWrap{ padding: 10px 10px 10px 10px;} .smartSearchResult a{ text-decoration: none;} .smartSearchResult #resultTitle{ font-size: 10pt; font-weight: bold;}";
styles += ".smartSearchResult #resultByline{ font-size: 8pt; color: #949494; } .smartSearchResult a.ui-state-focus { border:none; padding: 0; } .smartSearchResult .ui-state-focus .resultWrap { background: #0F699E; border:none; } .smartSearchResult .ui-state-focus .resultWrap div{background:none; color: #ffffff !important;}";

//Search bar CSS to fix positioning problems
styles += ".SearchImageButton{ position:absolute !important; padding:4px !important; top:4px !important; right:8px !important;} .SearchTextBox{padding: 5px 10px 5px 10px !important;margin:0 !important;border: 2px solid #efefef !important;} .SearchPanel{height:initial !important;padding: 0 !important;border: none !important;}";

//for IE
if(smartStyle.styleSheet){
  smartStyle.styleSheet.cssText = styles;
}
else{
  smartStyle.appendChild(document.createTextNode(styles));
}

//Appends CSS to head
head.appendChild(smartStyle);