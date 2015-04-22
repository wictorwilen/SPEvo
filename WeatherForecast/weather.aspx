<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="/_layouts/15/MicrosoftAjax.js"></script>
    <script type="text/javascript" src="/_layouts/15/init.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/SP.UserProfiles.js"></script>

  <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.0.2/jquery.simpleWeather.min.js"></script>

    <script type="text/javascript">
		function getQueryStringValue(name) {
			console && console.log(window.location);
            var qs = window.location.search.substring(1),
				pairs = qs.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split("=");
                if (pair[0] == name) {
                    return pair[1];
                }
            }
            return '';
        }

		function log(message) {
			if (typeof (console) !== "undefined") {
				console.log(message);
			}
		}

		function getUserPropertiesFromProfile(query) {
			var deferred = $.Deferred();

			// Get the current client context and PeopleManager instance.
			var clientContext = new SP.ClientContext.get_current(),
				peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

			// Get user profile properties for the current user
			userProfileProperties = peopleManager.getMyProperties();
            
            var propertyName = 'SPS-Location';
            
            if (query === 'home') {
                propertyName = 'HomeCity';
            }

			// Load the UserProfilePropertiesForUser object and send the request.
			clientContext.load(userProfileProperties);
			clientContext.executeQueryAsync(function(){
				log(userProfileProperties.get_userProfileProperties()[propertyName]);
				deferred.resolve(userProfileProperties.get_userProfileProperties()[propertyName]);
			}, function(sender, args){
				log("Something went wrong : '" + args.get_message() + "'");
				deferred.reject(args);
			});

			return deferred.promise();
		}

		function setupWeatherPart(query){
			$.simpleWeather({
				location: query,
				woeid: '',
				unit: 'c',
				success: function(weather) {
					log(weather);
					html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
					html += '<ul><li>'+weather.city+' '+weather.region+'</li></ul>';

				  $("#weather").html(html).removeAttr('style');
				},
				error: function(error) {
				  $("#weather").html('<p>'+error+'</p>').removeAttr('style');
				}
			});
		};

		function init(){
			var query = getQueryStringValue("query").replace('weather','').replace('%20','');
			query = query.replace('at%20', '');
			query = query.replace('in%20', '');
			console && console.log(query);

            if (query === 'evo') {
                $("#weather").html('<h2><i class="icon-34"></i> 100&deg;C</h2><ul><li>Evo</li></ul>').attr('style', 'background-image:url(https://spevo04.sharepoint.com/search/Pages/evo.png)');
            }
			else if (query.length < 1 || query === 'home' || query === 'office'){
				getUserPropertiesFromProfile(query).then(function (results) {
					query = results;

					if(query.length < 1){
						query = "London";
					}

					setupWeatherPart(query);
				});
			}
			else {
				setupWeatherPart(query);
			}
		}

		$(function() {
            init();
        });
    </script>

    <style>
        #s4-ribbonrow {
            display:none;
        }
	/*
  Docs at http://http://simpleweatherjs.com

  Look inspired by http://www.degreees.com/
  Used for demo purposes.

  Weather icon font from http://fonts.artill.de/collection/artill-weather-icons

  DO NOT hotlink the assets/font included in this demo. If you wish to use the same font icon then download it to your local assets at the link above. If you use the links below odds are at some point they will be removed and your version will break.
*/

@font-face {
    font-family: 'weather';
    src: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.eot');
    src: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.eot?#iefix') format('embedded-opentype'),
         url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.woff') format('woff'),
         url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.ttf') format('truetype'),
         url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/93/artill_clean_icons-webfont.svg#artill_clean_weather_iconsRg') format('svg');
    font-weight: normal;
    font-style: normal;
}

html {
  width: 100%;
  height: 100%;
  background-size: cover;
}

body {
  padding: 25px 0;
  font: 13px 'Open Sans', "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
}

#weather {
  width: 500px;
  margin: 0px auto;
  text-align: center;
  text-transform: uppercase;
  background: url('https://ssl.webpack.de/lorempixel.com/500/135/city/');
}

i {
  color: #fff;
  font-family: weather;
  font-size: 100px;
  font-weight: normal;
  font-style: normal;
  line-height: 1.0;
}

.icon-0:before { content: ":"; }
.icon-1:before { content: "p"; }
.icon-2:before { content: "S"; }
.icon-3:before { content: "Q"; }
.icon-4:before { content: "S"; }
.icon-5:before { content: "W"; }
.icon-6:before { content: "W"; }
.icon-7:before { content: "W"; }
.icon-8:before { content: "W"; }
.icon-9:before { content: "I"; }
.icon-10:before { content: "W"; }
.icon-11:before { content: "I"; }
.icon-12:before { content: "I"; }
.icon-13:before { content: "I"; }
.icon-14:before { content: "I"; }
.icon-15:before { content: "W"; }
.icon-16:before { content: "I"; }
.icon-17:before { content: "W"; }
.icon-18:before { content: "U"; }
.icon-19:before { content: "Z"; }
.icon-20:before { content: "Z"; }
.icon-21:before { content: "Z"; }
.icon-22:before { content: "Z"; }
.icon-23:before { content: "Z"; }
.icon-24:before { content: "E"; }
.icon-25:before { content: "E"; }
.icon-26:before { content: "3"; }
.icon-27:before { content: "a"; }
.icon-28:before { content: "A"; }
.icon-29:before { content: "a"; }
.icon-30:before { content: "A"; }
.icon-31:before { content: "6"; }
.icon-32:before { content: "1"; }
.icon-33:before { content: "6"; }
.icon-34:before { content: "1"; }
.icon-35:before { content: "W"; }
.icon-36:before { content: "1"; }
.icon-37:before { content: "S"; }
.icon-38:before { content: "S"; }
.icon-39:before { content: "S"; }
.icon-40:before { content: "M"; }
.icon-41:before { content: "W"; }
.icon-42:before { content: "I"; }
.icon-43:before { content: "W"; }
.icon-44:before { content: "a"; }
.icon-45:before { content: "S"; }
.icon-46:before { content: "U"; }
.icon-47:before { content: "S"; }

#weather h2 {
  margin: -10px 0 0 0;
  color: #fff;
  font-size: 75px;
  font-weight: 300;
  text-align: center;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);
}

#weather ul {
  margin: 0;
  padding: 0;
}

#weather li {
  background: #fff;
  background: rgba(255,255,255,0.90);
  padding: 10px;
  margin-top:-25px;
  display: inline-block;
  border-radius: 5px;
}

#weather .currently {
  margin: 0 20px;
}
    </style>
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Weather
</asp:Content>

<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<!-- Docs at http://http://simpleweatherjs.com -->
	<div id="weather"></div>
</asp:Content>
