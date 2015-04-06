// Site Tags
_EnsureJSNamespace("Wictor")
Wictor.SiteTags = Wictor.SiteTags|| {};

Wictor.SiteTags = function () {
    "use strict";
    var init = function () {
        SP.SOD.registerSod('callout.js', 'https:\u002f\u002fcdn.sharepointonline.com\u002f14980\u002f_layouts\u002f15\u002f16.0.3912.1217\u002fcallout.js');

        SP.SOD.executeFunc('callout.js', 'Callout', function () {

            $('#RibbonContainer-TabRowRight').prepend(html)
            $('#RibbonContainer-TabRowRight').prepend(panelHtml)
            
            // Get Launch Point
            var launchPoint = $get('site_tags_button');

            // Create Callout
            var options = new CalloutOptions();
            options.launchPoint = launchPoint;
            options.contentElement = $get('siteInfoPanel');
            options.ID = 'siteInfoCallout';
            options.title = 'Site Tags';
            options.onOpenedCallback = loadSiteInfo;


            // Find existing Callout
            callout = CalloutManager.getFromLaunchPointIfExists(launchPoint);
            if (callout != null) {
                callout.set(options)
            } else {
                // Create new Callout
                callout = CalloutManager.createNew(options);

                // add actions
                var action = new CalloutAction({
                    text: "Save tags",
                    onClickCallback: function () {
                        // Set the value
                        var tags = $get('siteInfoTags').value;
                        allProperties.set_item('WW_SiteTags', tags)
                        // Update vti_indexedpropertykeys
                        var vti_indexedpropertykeys = "";
                        if (typeof allProperties.get_fieldValues()['vti_indexedpropertykeys'] !== 'undefined') {
                            vti_indexedpropertykeys = allProperties.get_item('vti_indexedpropertykeys')
                        }
                        var base64 = "VwBXAF8AUwBpAHQAZQBUAGEAZwBzAA==" // [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes("WW_SiteTags"))
                        if (vti_indexedpropertykeys.indexOf(base64) == -1) {
                            vti_indexedpropertykeys += base64 + "|"
                            allProperties.set_item('vti_indexedpropertykeys', vti_indexedpropertykeys)
                        }
                        // Force reindex
                        var vti_searchversion = 0
                        if (typeof allProperties.get_fieldValues()['vti_searchversion'] !== 'undefined') {
                            vti_searchversion = allProperties.get_item('vti_searchversion')
                        }
                        vti_searchversion++
                        allProperties.set_item('vti_searchversion', vti_searchversion)
                        web.update();
                        context.executeQueryAsync(function () {
                            callout.close();
                            SP.UI.Notify.addNotification("Site updated with new tags");
                        }, loadSiteInfoFailed);

                    }
                });
                callout.addAction(action);

                callout.addAction(new CalloutAction({
                    text: "Edit Site Info",
                    onClickCallback: function () {
                        window.location.href = SP.Utilities.Utility.getLayoutsPageUrl('prjsetng.aspx');
                    }
                }));
            }
        });
    },
    // Callout action
    loadSiteInfo = function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            context = SP.ClientContext.get_current();
            web = context.get_web();
            allProperties = web.get_allProperties();
            context.load(web);
            context.load(allProperties);
            context.executeQueryAsync(loadSiteInfoSucceeded, loadSiteInfoFailed);
        });
    },
    loadSiteInfoSucceeded = function () {
       if (typeof allProperties.get_fieldValues()['WW_SiteTags'] !== 'undefined') {
           $get('siteInfoTags').value = allProperties.get_item('WW_SiteTags')
       }
       

    },
    loadSiteInfoFailed = function () {
        alert('An error is malfunctioning');
    },

    allProperties = null,
    web = null,
    context = null,
    callout = null,
    multiString = function (f) {
        return f.toString().split('\n').slice(1, -1).join('\n');
    },
    html = '<a onclick="return false;" id="site_tags_button" title="" class="ms-promotedActionButton" href="javascript:return false;" style="display:inline-block;"><span style="height:16px;width:16px;position:relative;display:inline-block;overflow:hidden;" class="s4-clust ms-promotedActionButton-icon"><img src="/_layouts/15/images/spcommon.png?rev=38" style="position: absolute; left: -180px; top: -174px;"></span><span class="ms-promotedActionButton-text">Site tags</span></a>',
    panelHtml = multiString(function(){/**
<div style="display: none">
    <div id="siteInfoPanel">
        <b>Tags</b>: <input type='text' id='siteInfoTags'></input>
    </div>
</div>
**/})
    ;

    return {
        init: init
    }
}();

Wictor.Register = function () {
    $(document).ready(Wictor.SiteTags.init)
}

Wictor.MdsRegister = function () {
    var thisUrl = "";
    if (_spPageContextInfo.siteServerRelativeUrl == '/')
        thisUrl = _spPageContextInfo.siteServerRelativeUrl + "SiteAssets/Wictor.SiteTags.js"
    else
        thisUrl = _spPageContextInfo.siteServerRelativeUrl + "/SiteAssets/Wictor.SiteTags.js"   
    Wictor.SiteTags.init()
    RegisterModuleInit(thisUrl, Wictor.SiteTags.init)
}

if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
    Wictor.MdsRegister()
} else {
    Wictor.Register()
}
