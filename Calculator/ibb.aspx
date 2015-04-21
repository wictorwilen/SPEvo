<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint,Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"     MasterPageFile="~masterurl/default.master" Language="C#" %>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
<style type="text/css">
#s4-ribbonrow {
display:none !important;
}
</style>
    <script type="text/javascript">
        function getQueryStringValue(name) {
            var qs = window.location.search.substring(1);
            var pairs = qs.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split("=");
                if (pair[0] == name) {
                    return window.unescape(pair[1]);
                }
            }
            return '';
        }
        _spBodyOnLoadFunctions.push(function () {
            var query = getQueryStringValue("query")
			var match = query.match(/\d+\s*[/\+\-\/*]\s*\d+/)
            try {
                document.getElementById("result").innerHTML = eval(match[0])
            } catch (e) {
                document.getElementById("result").innerHTML = "error"
            }
        });
    </script>
    
</asp:Content>
 
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Intelligent Best Bet
</asp:Content>
 
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <h1>SharePoint Search Calculator</h1>
    <h2>The result is: <span id="result"></span></h2>
</asp:Content>