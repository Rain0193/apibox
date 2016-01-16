define(['talent',
	'templates/apibox',
	'views/apibox/header-view',
	'views/apibox/add-interface-view',
	'views/apibox/content-view'
], function(Talent,
	jst,
	Header,
	AddInterface,
	Content) {
	var MainView = Talent.Layout.extend({
		template: jst['apibox/index-page'],
		className: 'home-page-container',
		events: function() {
			var events = {};
			return events;
		},
		regions: {
			"header": ".indexheader",
			"icontent": ".indexContent"
		},
		initialize: function() {
			var self = this;
			Talent.app.request("apibox:getAllData").done(function(resp) {
				self.Data = resp.message==""?"":JSON.parse(resp.message);
			});
			this.count = 0;
		},
		onRender: function() {
			var self = this;
			this.headerView = new Header({
				model: new Talent.Model({
					data: this.datalist
				})
			});
			var ContentView = Talent.Model.extend({
				defaults:{
						count:self.newCount()
					}
				});
			this.contentView = new Content({
				model:new ContentView()
			}); 
			this.addInterfaceView = new AddInterface();
			this.listenTo(this.headerView, "add:interface", function() {
				self.icontent.show(self.addInterfaceView);
			});
			this.listenTo(this.headerView,"go:indexPage",function(){
				self.icontent.show(self.contentView);
			});
			this.listenTo(this.addInterfaceView, "add:content", function() {
				var countString = self.newCount();
				this.contentView.model.set("count",countString);
				self.icontent.show(self.contentView);

			});
		},
		newCount:function(){
			var self = this;
			self.count = 0;
			Talent.app.request("apibox:getAllData").done(function(resp) {
				self.Data = jQuery.parseJSON(resp.message);
			});
			_.each(self.Data,function(list){
				self.count +=list.apis.length;
			});
			var CountStr = [];
			var numString = self.count.toString();
			var ys = numString.length%3;
			_.each(numString,function(item,index){
				CountStr.unshift(item);
				if(index>ys&&index<numString.length-2){
					CountStr.unshift("，");
				}
			});
			return CountStr.join("");
		},
		onShow: function() {
			this.header.show(this.headerView);
			this.icontent.show(this.contentView);
		},
		onClose: function() {}
	});
	return Talent.BasePageView.extend({
		layout: "empty-layout",
		mainViewClass: MainView,
		pageTitle: 'apibox'
	});
});
