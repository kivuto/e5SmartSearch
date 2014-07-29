var productList = []; //Local Array for products 
var searchBarID = "#project"; // ID name of search bar autocomplete is to use.

$(function() {
  var e5Data = "http://e5webservices.onthehub.com/data/v1/institutions/46817193-1960-4ce3-925c-8556e8dc7b93/webstores?callback=?";

  //Parses JSON API data into local array for autocomplete access and speed.
  $.getJSON( e5Data, null, function(products) {

    for(i=0;i < products[0].ProductMajorVersions.length; i++){
      productList.push({  "label": products[0].ProductMajorVersions[i].ProductMajorVersionName,
                "desc": products[0].ProductMajorVersions[i].ProducerOrganizationName,
                "prodHref": products[0].ProductMajorVersions[i].OfferingListUrl});
    }
  });

  
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
        ul.addClass("smartSearch"); //Adds class to keep styling seperate.
        return $( "<li class='smartSearchResult'>" )
        .data("ui-autocomplete-item", item)
        .append("<a href='" + item.prodHref + "&srch=" + item.label + "'><div class='resultWrap'><div id='resultTitle'>" + item.label + "</div><div id='resultByline'>" + item.desc + "</div></div></a>" )
        .appendTo( ul );
  };
  $(".ui-autocomplete").removeClass("ui-corner-all"); //Removes rounded corners applied by jQuery UI as default.

});

//Adds CSS styles for Smart Search
var smartStyle = document.createElement('style');
smartStyle.type = 'text/css';
head = document.head;

//Smart Search Box Styles
var styles = ".smartSearch{ border: 2px solid #efefef; border-top: none; padding-left:2px; width: 224px; max-height:300px; overflow-y:scroll; overflow-x:hidden;} .smartSearch .ui-menu-item a {padding:0; line-height:initial;} .ui-menu .smartSearchResult { padding: 0 ;} .ui-menu .smartSearchResult .resultWrap{ padding: 10px 10px 10px 10px;} .smartSearchResult a{ text-decoration: none;} .smartSearchResult #resultTitle{ font-size: 10pt; font-weight: bold;}";
styles += ".smartSearchResult #resultByline{ font-size: 8pt; color: #949494; } .smartSearchResult a.ui-state-focus { border:none; } .smartSearchResult .ui-state-focus .resultWrap {  border:none; background: #0F699E; } .smartSearchResult .ui-state-focus .resultWrap div{ background:none; color: #ffffff !important;}";

//Search Bar Styling to Fix Positioning Issues
styles += ".SearchImageButton{ position:absolute; padding:4px; top:4px; right:8px;} .SearchTextBox{ padding: 5px 10px 5px 10px; margin:0; border: 2px solid #efefef;} .SearchPanel{height:initial;padding: 0 !important;border: none;}";

//Appending Stylesheet to Document
if(smartStyle.styleSheet){
  style.styleSheet.cssText = styles;
}
else{
  smartStyle.appendChild(document.createTextNode(styles));
}

head.appendChild(smartStyle);