console.log("InstantSearch.js file loaded");

jQuery(function() {
    console.log("Document loaded. Initiating Instant search...");
    
    $.widget( "custom.catcomplete", $.ui.autocomplete, {
        _create: function() {
            this._super();
            this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
        },
        _renderMenu: function( ul, items ) {
            var that = this,
            currentCategory = "";
            $.each( items, function( index, item ) {
                var li;
                if ( item.category != currentCategory ) {
                      ul.append( '<li class="ui-autocomplete-category">' + item.category + "</li>" );
                      currentCategory = item.category;
                }
                li = that._renderItemData( ul, item );
                if ( item.category ) {
                    li.attr( "aria-label", item.category + " : " + item.label );
                }
            });
        }
    });
    
    $("#SearchBox input[type=text]").catcomplete({
        source: searchForContent,
        select: function(event, ui) {
            location.href = ui.item.url;
        }
    }).catcomplete("instance")._renderItem = function(ul, item) {
        return $('<li class="ui-autocomplete-item">')
        .append('<a><img src="' + item.image + '"/>' + item.title + '<br/>' + item.description + '</a>')
        .appendTo(ul);
    };
    
    function searchForContent(request, response) {
        search(request.term)
            .done(function(results) {
                response(results);
            })
            .fail(function() {
                response();
            });
    }
    
    function getValueFromResults(key, results) {
        var value = '';

        if (results != null &&
            results.length > 0 &&
            key != null) {
            for (var i = 0; i < results.length; i++) {
                var resultItem = results[i];

                if (resultItem.Key === key) {
                    value = resultItem.Value;
                    break;
                }
            }
        }

        return value;
    }
    
    function search(query) {
        var deferred = $.Deferred();
        
        $.when(
            searchForSites(query),
            searchForPeople(query),
            searchForGroups(query),
            searchForDocuments(query),
            searchInMyRecentDocuments(query),
            searchInTrendingDocuments(query)
        )
        .done(function(sites, people, groups, documents, myRecentDocuments, trendingDocuments) {
            var results = [];
            
            if (myRecentDocuments && myRecentDocuments.length > 0 && myRecentDocuments[0].d && myRecentDocuments[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                myRecentDocuments[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('Title', cells),
                        description: getValueFromResults('SiteTitle', cells),
                        url: getValueFromResults('Path', cells),
                        image: '/_layouts/15/images/siteIcon.png?rev=38',
                        category: 'My recent documents'
                    });
                });
                
                console.log('My recent documents:' + total);
            }
            
            if (people && people.length > 0 && people[0].d && people[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                people[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('PreferredName', cells),
                        description: getValueFromResults('JobTitle', cells),
                        url: getValueFromResults('Path', cells),
                        image: getValueFromResults('PictureURL', cells),
                        category: 'People'
                    });
                });
                
                console.log('People:' + total);
            }
            
            if (trendingDocuments && trendingDocuments.length > 0 && trendingDocuments[0].d && trendingDocuments[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                trendingDocuments[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('Title', cells),
                        description: getValueFromResults('SiteTitle', cells),
                        url: getValueFromResults('Path', cells),
                        image: '/_layouts/15/images/siteIcon.png?rev=38',
                        category: 'Trending documents'
                    });
                });
                
                console.log('Trending documents:' + total);
            }
            
            if (sites && sites.length > 0 && sites[0].d && sites[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                sites[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('Title', cells),
                        description: '',
                        url: getValueFromResults('Path', cells),
                        image: '/_layouts/15/images/siteIcon.png?rev=38',
                        category: 'Sites'
                    });
                });
                
                console.log('Sites:' + total);
            }
            
            if (groups && groups.length > 0 && groups[0].d && groups[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                groups[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('Title', cells),
                        description: getValueFromResults('Description', cells),
                        url: getValueFromResults('Path', cells),
                        image: '/_layouts/15/images/siteIcon.png?rev=38',
                        category: 'Groups'
                    });
                });
                
                console.log('Groups:' + total);
            }
    
            if (documents && documents.length > 0 && documents[0].d && documents[0].d.query.PrimaryQueryResult) {
                var total = 0;
                
                documents[0].d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(function(row) {
                    var cells = row.Cells.results;
                    
                    total += parseFloat(getValueFromResults('Rank', cells));
                    
                    results.push({
                        title: getValueFromResults('Title', cells),
                        description: getValueFromResults('SiteTitle', cells),
                        url: getValueFromResults('Path', cells),
                        image: '/_layouts/15/images/siteIcon.png?rev=38',
                        category: 'Documents'
                    });
                });
                
                console.log('Documents:' + total);
            }

            deferred.resolve(results);
        })
        .fail(function() {
            deferred.reject();
        });
        
        return deferred.promise();
    }
    
    function searchForSites(query) {
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + " contentclass:STS_Site contentclass:STS_Web'&RowLimit=2",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
    
    function searchForPeople(query) {
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + "'&RowLimit=2&sourceid='b09a7990-05ea-4af9-81ef-edfab16c4e31'&rankingmodelid='d9bfb1a1-9036-4627-83b2-bbd9983ac8a1'",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
    
    function searchForGroups(query) {
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + " WebTemplate:GROUP'&RowLimit=2",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
    
    function searchForDocuments(query) {
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + " isdocument:1'&RowLimit=2&SelectProperties='Title,Path,SiteTitle'",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
    
    function searchInMyRecentDocuments(query) {        
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + " AND (FileExtension:doc OR FileExtension:docx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:xlsm OR FileExtension:pdf)'&RowLimit=2&Properties='GraphQuery:actor(me\\,or(action\\:1001\\,action\\:1003))'&ClientType='SPEvo15'",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
    
    function searchInTrendingDocuments(query) {
        return $.ajax({
            url: "/_api/search/query?querytext='" + query + " AND (FileExtension:doc OR FileExtension:docx OR FileExtension:ppt OR FileExtension:pptx OR FileExtension:xls OR FileExtension:xlsx OR FileExtension:xlsm OR FileExtension:pdf)'&RowLimit=2&Properties='GraphQuery:actor(me)'&ClientType='SPEvo15'",
            type: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
    }
});