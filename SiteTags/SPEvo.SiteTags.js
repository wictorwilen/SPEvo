// Site Tags
_EnsureJSNamespace("SPEvo")
SPEvo.SiteTags = SPEvo.SiteTags|| {};

SPEvo.SiteTags = function () {
    "use strict";
    var init = function () {
        SP.SOD.registerSod('callout.js', 'https:\u002f\u002fcdn.sharepointonline.com\u002f14980\u002f_layouts\u002f15\u002f16.0.3912.1217\u002fcallout.js');
        SP.SOD.executeFunc('sp.js', null, function () {
            SP.SOD.executeFunc('callout.js', 'Callout', function () {

                $('#RibbonContainer-TabRowRight').prepend(html)
                $('#RibbonContainer-TabRowRight').prepend(panelHtml)
            
                mask = new SP.BasePermissions()
                mask.set(SP.PermissionKind.manageWeb)

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

                    var action = new CalloutAction({
                        text: "Save tags",
                        onClickCallback: function () {
                            // Set the value
                            allProperties.set_item('SPEvo_SiteTag1', $get('siteInfoTags1').value)
                            allProperties.set_item('SPEvo_SiteTag2', $get('siteInfoTags2').value)
                            allProperties.set_item('SPEvo_SiteTag3', $get('siteInfoTags3').value)

                            // Update vti_indexedpropertykeys
                            var vti_indexedpropertykeys = "";
                            if (typeof allProperties.get_fieldValues()['vti_indexedpropertykeys'] !== 'undefined') {
                                vti_indexedpropertykeys = allProperties.get_item('vti_indexedpropertykeys')
                            }
                            var base64 = [// [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes("SPEvo_SiteTag1"))
                                "UwBQAEUAdgBvAF8AUwBpAHQAZQBUAGEAZwAxAA==",
                                "UwBQAEUAdgBvAF8AUwBpAHQAZQBUAGEAZwAyAA==",
                                "UwBQAEUAdgBvAF8AUwBpAHQAZQBUAGEAZwAzAA=="
                            ];
                            for (var i in base64) {
                                var b = base64[i]
                                if (vti_indexedpropertykeys.indexOf(b) == -1) {
                                    vti_indexedpropertykeys += b + "|"
                                }
                            }
                            allProperties.set_item('vti_indexedpropertykeys', vti_indexedpropertykeys)

                            // Force reindex
                            var vti_searchversion = 0
                            if (typeof allProperties.get_fieldValues()['vti_searchversion'] !== 'undefined') {
                                vti_searchversion = allProperties.get_item('vti_searchversion')
                            }
                            vti_searchversion++
                            allProperties.set_item('vti_searchversion', vti_searchversion)

                            // Update the web
                            web.update();
                            context.executeQueryAsync(function () {
                                callout.close();
                                SP.UI.Notify.addNotification("Site updated with new tags");
                            }, loadSiteInfoFailed);

                        },
                        isEnabledCallback: function () {
                            if (permissions != null) {
                                return permissions.get_value();
                            }
                            return false;
                        }

                    });
                    callout.addAction(action);

                    callout.addAction(new CalloutAction({
                        text: "Edit Site Info",
                        onClickCallback: function () {
                            window.location.href = SP.Utilities.Utility.getLayoutsPageUrl('prjsetng.aspx');
                        },
                        isEnabledCallback: function () {
                            if (permissions != null) {
                                return permissions.get_value();
                            }
                            return false;
                        }
                    }));
                }


            });
        });
    },    
    // Callout action
    loadSiteInfo = function () {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            context = SP.ClientContext.get_current();
            web = context.get_web();
            allProperties = web.get_allProperties();
            permissions = web.doesUserHavePermissions(mask)
            context.load(web);
            context.load(allProperties);
            context.executeQueryAsync(loadSiteInfoSucceeded, loadSiteInfoFailed);
        });
    },
    loadSiteInfoSucceeded = function () {
        $get('siteInfoTags1').disabled = !permissions.get_value()
        $get('siteInfoTags2').disabled = !permissions.get_value()
        $get('siteInfoTags3').disabled = !permissions.get_value()
        callout.refreshActions()

       if (typeof allProperties.get_fieldValues()['SPEvo_SiteTag1'] !== 'undefined') {
           $get('siteInfoTags1').value = allProperties.get_item('SPEvo_SiteTag1').replace('\n', ';')
       }
       if (typeof allProperties.get_fieldValues()['SPEvo_SiteTag2'] !== 'undefined') {
           $get('siteInfoTags2').value = allProperties.get_item('SPEvo_SiteTag2').replace('\n', ';')
       }
       if (typeof allProperties.get_fieldValues()['SPEvo_SiteTag3'] !== 'undefined') {
           $get('siteInfoTags3').value = allProperties.get_item('SPEvo_SiteTag3').replace('\n', ';')
       }
       

    },
    loadSiteInfoFailed = function () {
        alert('An error is malfunctioning');
    },

    allProperties = null,
    web = null,
    context = null,
    callout = null,
    permissions = null,
    mask = null,
    multiString = function (f) {
        return f.toString().split('\n').slice(1, -1).join('\n');
    },
    html = '<a onclick="return false;" id="site_tags_button" title="" class="ms-promotedActionButton" href="javascript:return false;" style="display:inline-block;"><span style="height:16px;width:16px;position:relative;display:inline-block;overflow:hidden;" class="s4-clust ms-promotedActionButton-icon"><img src="/_layouts/15/images/spcommon.png?rev=38" style="position: absolute; left: -180px; top: -174px;"></span><span class="ms-promotedActionButton-text">Site tags</span></a>',
    panelHtml = multiString(function(){/**
<div style="display: none">
    <div id="siteInfoPanel">
        <b>Tags</b>:
        <br/> 
        <input type='text' id='siteInfoTags1' disabled='disabled'></input>
        <br/> 
        <input type='text' id='siteInfoTags2' disabled='disabled'></input>
        <br/> 
        <input type='text' id='siteInfoTags3' disabled='disabled'></input>
    </div>
</div>
**/})
    ;

    return {
        init: init
    }
}();

SPEvo.Register = function () {
    $(document).ready(SPEvo.SiteTags.init)
}

SPEvo.MdsRegister = function () {
    var thisUrl = "";
    if (_spPageContextInfo.siteServerRelativeUrl == '/')
        thisUrl = _spPageContextInfo.siteServerRelativeUrl + "SiteAssets/SPEvo.SiteTags.js"
    else
        thisUrl = _spPageContextInfo.siteServerRelativeUrl + "/SiteAssets/SPEvo.SiteTags.js"   
    SPEvo.SiteTags.init()
    RegisterModuleInit(thisUrl, SPEvo.SiteTags.init)
}

if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
    SPEvo.MdsRegister()
} else {
    SPEvo.Register()
}
