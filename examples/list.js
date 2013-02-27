ItemView = Marionette.ItemView.extend({
  template:"#item-template",
  tagName:'tr',
  templateHelpers:function(){
    return {
      lazyAttr:lazyAttr.bind({},this,this.model)
    }
  }
});
ListView = Marionette.CompositeView.extend({
  itemView:ItemView,
  template:"#list-template",
  itemViewContainer:"tbody"
});

collection = new Backbone.Collection([{id:1}]);

view = new ListView({collection:collection});
view.render();
$("body").append(view.$el);

common = new Backbone.Model({value:1});

collection.reset(_.map(_.range(0,1000),function(i){
    return {id:i+1,common:common}
}));
var i =0;
var average;
var start = new Date();
setInterval(function(){
  ++i;
  average = i*1000/(new Date()-start);
  common.set('value',average);
},1);