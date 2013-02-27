BasicView = Marionette.ItemView.extend({
  template:"#basic-template",
  mixinTemplateHelpers:function(){
    return {
      lazyAttr:lazyAttr.bind({},this,this.model)
    }
  }
});


mother = new Backbone.Model({name:'Barbara'});
child = new Backbone.Model({name:'child','mother':mother});
child.set('mother',mother);





view = new BasicView({model:child});
view.render();
$("body").append(view.$el);