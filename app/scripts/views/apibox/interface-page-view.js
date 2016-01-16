define(['talent',
		'templates/apibox',
		'views/apibox/server-check-view',
		'views/apibox/mock-data-view'
	],
	function(Talent,
		jst,
		ServerCheckView,
		MockDataView) {
		return Talent.Layout.extend({
			template: jst['apibox/interface-page'],
			regions:{
				dataLayerRegion : ".data-layer-data-layer"
			},
			events: function() {
				var events = {};
				events["click .data-mock-btn"] = this.dataMockShow;
				events["click .server-check-btn"] = this.serverCheckShow;
				return events;
			},
			initialize: function() {},
			onShow:function(){},
			dataMockShow:function(e){
				var self=this;
				this.$(".data-layer").show();
				this.mockDataView = new MockDataView({model:new Talent.Model({"data":self.model.get("response")})});
				this.dataLayerRegion.show(this.mockDataView)
				this.listenTo(this.mockDataView,"cancle:mock",this.closeDataRegionClose);
			},
			serverCheckShow:function(e){
				this.$(".data-layer").show();
				this.serverCheckView = new ServerCheckView({model:new Talent.Model({"data":self.model.get("response")})});
				this.dataLayerRegion.show(this.serverCheckView)
				this.listenTo(this.serverCheckView,"cancle:diff",this.closeDataRegionClose);
			},
			closeDataRegionClose:function(){
				this.dataLayerRegion.close();
				this.$(".data-layer").hide()
			}
		});

	});