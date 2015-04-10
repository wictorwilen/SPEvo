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
                            var vti_indexedpropertykeys = "";
                            if (typeof allProperties.get_fieldValues()['vti_indexedpropertykeys'] !== 'undefined') {
                                vti_indexedpropertykeys = allProperties.get_item('vti_indexedpropertykeys')
                            }
                            for (var t in tags) {
                                var tag = tags[t]
                                var b64 = SPEvo.SiteTags.base64Encode(tag.property) + "|"

                                // Set the value
                                var val = $get(tag.input).value
                                if (val == "" || val == null || typeof val == 'undefined') {
                                    allProperties.set_item(tag.property, null)
                                    vti_indexedpropertykeys = vti_indexedpropertykeys.replace(b64, "")
                                } else {
                                    allProperties.set_item(tag.property, val)
                                    if (vti_indexedpropertykeys.indexOf(b64) == -1) {
                                        vti_indexedpropertykeys += b64
                                    }
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
        for (var t in tags) {
            var tag = tags[t]
            $get(tag.input).disabled = true
            $get(tag.input).value = ""
        }
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
            if (context == null) {
                context = SP.ClientContext.get_current();
                web = context.get_web();
                allProperties = web.get_allProperties();
                permissions = web.doesUserHavePermissions(mask)
                context.load(web);
                context.load(allProperties);

            }
            
            context.executeQueryAsync(loadSiteInfoSucceeded, loadSiteInfoFailed);
        });
    },
    loadSiteInfoSucceeded = function () {
        for (var t in tags) {
            var tag = tags[t]
            $get(tag.input).disabled = !permissions.get_value()
            var val = allProperties.get_fieldValues()[tag.property]
            if (typeof val !== 'undefined' && val != null) {
                $get(tag.input).value = val
            }
        }
       callout.refreshActions()
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
    tags = [
        {
            'input': 'siteInfoTags1',
            'property': 'SPEvo_SiteTag1'
        },
        {
            'input': 'siteInfoTags2',
            'property': 'SPEvo_SiteTag2'
        },
        {
            'input': 'siteInfoTags3',
            'property': 'SPEvo_SiteTag3'
        }
    ],
    // http://stackoverflow.com/questions/17913609/javascript-unicode-base64-encode
    utf16To64 = function (str) {
        return base16To64(utf16To16(str));
    },
    base16To64 = function (arr16) {
        return base8To64(base16To8(arr16));
    },
    base8To64 = function (arr8) {
        return base6To64(base8To6(arr8));
    },
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base6To64 = function (arr6) {
        var i, b64 = '';
        for (i = 0; i < arr6.length; ++i) b64 += chars.charAt(arr6[i]);
        i = b64.length % 4;
        b64 += ['', '==', '==', '='][i];
        return b64;
    },
    base16To8 = function (arr16) {
        var i, arr8 = [];
        for (i = 0; i < arr16.length; ++i)
            arr8.push(arr16[i] >>> 8, arr16[i] & 255);
        return arr8;
    },
    base8To6 = function (arr8) {
        var arr6 = [], i, e1, e2, e3, s1, s2, s3, s4, d1, d2, d3;
        for (i = 0; i < arr8.length; i += 3) {
            e1 = (d1 = arr8[i]    ) & 255;
            e2 = (d2 = arr8[i + 1]) & 255;
            e3 = (d3 = arr8[i + 2]) & 255;
            s1 =                     e1 >>> 2 ;
            s2 = ((e1 &  3) << 4) + (e2 >>> 4);
            s3 = ((e2 & 15) << 2) + (e3 >>> 6);
            s4 =   e3 & 63                    ;
            arr6.push(s1, s2);
            if (d3 !== undefined)
                arr6.push(s3, s4);
            else if (d2 !== undefined)
                arr6.push(s3);
        }
        arr6.byteLength = arr8.length;
        return arr6;
    },
    utf16To16 = function (str) {
        var arr16 = [], i, c;
        for (i = 0; i < str.length; ++i) {
            c = str.charCodeAt(i) & 65535;
            arr16.push(((c & 255) << 8) + (c >>> 8));
        }
        return arr16;
    },
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
        base64Encode: utf16To64,
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
