var context = SP.ClientContext.get_current()
var web = context.get_web()
var customActions = web.get_userCustomActions();
var customAction = customActions.add();
customAction.set_location('ScriptLink');
customAction.set_scriptSrc('~SiteCollection/SiteAssets/SPEvo.SiteTags.js');
customAction.set_sequence(1100);
customAction.set_title('SiteTags');
customAction.set_description('Site Tags');
customAction.update();

context.executeQueryAsync(
  function () {
      alert('Done')
  },
  function () {
      alert('Error')
  })

var context = SP.ClientContext.get_current()
var web = context.get_web()
var customActions = web.get_userCustomActions();
var customAction = customActions.add();
customAction.set_location('ScriptLink');
customAction.set_scriptSrc('~SiteCollection/SiteAssets/jquery-2.1.3.min.js');
customAction.set_sequence(1000);
customAction.set_title('jQuery');
customAction.set_description('jQuery 2.1.3');
customAction.update();

context.executeQueryAsync(
  function () {
      alert('Done')
  },
  function () {
      alert('Error')
  })
/*------------*/
var context = SP.ClientContext.get_current()
var web = context.get_site()
var customActions = web.get_userCustomActions();
var customAction = customActions.add();
customAction.set_location('ScriptLink');
customAction.set_scriptSrc('~SiteCollection/SiteAssets/SPEvo.SiteTags.js');
customAction.set_sequence(1100);
customAction.set_title('SiteTags');
customAction.set_description('Site Tags');
customAction.update();

context.executeQueryAsync(
  function () {
      alert('Done')
  },
  function () {
      alert('Error')
  })

var context = SP.ClientContext.get_current()
var web = context.get_site()
var customActions = web.get_userCustomActions();
var customAction = customActions.add();
customAction.set_location('ScriptLink');
customAction.set_scriptSrc('~SiteCollection/SiteAssets/jquery-2.1.3.min.js');
customAction.set_sequence(1000);
customAction.set_title('jQuery');
customAction.set_description('jQuery 2.1.3');
customAction.update();

context.executeQueryAsync(
  function () {
      alert('Done')
  },
  function () {
      alert('Error')
  })
