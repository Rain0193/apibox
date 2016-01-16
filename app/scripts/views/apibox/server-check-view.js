define(['talent',
		'templates/apibox',
		"jsdiff"
	],
	function(Talent,
		jst,
		jsDiff) {
		return Talent.ItemView.extend({
			template: jst['apibox/check-page'],
			diffTemplate: jst['apibox/diff-page'],
			diffType:["diffChars","diffWords","diffLines"],
			events: function() {
				var events = {};
				events["click .diff-btn"] = this.diffDataDeal;
				events["click .cancle-diff-btn"] = this.cancleDiff;
				events["keyup .server-data"] =this.formatServerData;
				return events;
			},
			initialize: function() {
				var data =_.formatJson(this.model.get("data"));
				this.model.set("data",data);
			},
			onShow: function() {
				var self = this;
				var pid=this.model.get("config")["project"];
				var id=this.model.get("config")["id"];
				Talent.app.request("apibox:getRealServerData",{"pid":pid,"id":id}).done(function(resp) {
					var serverData = "";
					if(resp.status==200){
						try{
							JSON.parse(resp.data);
							serverData = _.formatJson(resp.data); 
						}catch(err){
							serverData = resp.Data;
							self.$(".server-data").html("<pre>"+serverData+"</pre>")
						}
					}else{
						serverData = "          请求接口失败，请直接拷贝正式场景的返回数据做对比"
					}
					self.$(".server-data").html("<pre>"+serverData+"</pre>")
				});

			},
			diffDataDeal:function(){
				var serverData = this.$(".server-data>pre").html();
				var apiData = this.$(".interface-data>pre").html();
				var diff = jsDiff[this.diffType[2]](apiData,serverData);
				var diffData = this.diffTemplate({diff:diff})
				this.$(".diff-data").html("<pre>"+diffData+"</pre>")
			},
			formatServerData:function(e){
				var serverData = this.$(".server-data>pre").html();
				try{
					JSON.parse(serverData);
					serverData = _.formatJson(serverData); 
					this.$(".server-data").html("<pre>"+serverData+"</pre>")
				}catch(err){
					console.log("修改data非标准JSON");
				}
				
			},
			cancleDiff: function() {
				this.trigger("cancle:diff")
			}
		});

	});