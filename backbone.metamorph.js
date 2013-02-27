var lazyAttr = function(view,context,path,decorator){
  return (new LazyAttribute(view,context,path,decorator)).render();
};

LazyAttribute = function(view,context,path,decorator){
  this.view = view;
  if(decorator){this.decorator = decorator}
  this.context = context;
  this.path = path || '';
  this.bindEvents();
  this.metamorph = new Metamorph(
    this.decorator(this.value())
  );
};

_.extend(LazyAttribute.prototype,{
  decorator:function(value){
    return _.isUndefined(value) ? '' : value;
  },
  render:function(){
    return this.metamorph.outerHTML();
  },
  valueOf:function(thing,attr){
    if(thing==undefined){
      return undefined
    }
    return thing[attr] || (thing.get || function(){}).call(thing,attr);
  },
  value:function(){
    var path = this.path.split('.');
    var self = this;
    var value = this.context;
    _.each(path,function(attr){
      value = self.valueOf(value,attr);
    });
    return value;
  },
  listenDeep:function(){
    var path = this.path.split('.');
    var self = this;
    var context = this.context;
    _.each(path,function(attr,i){
      if(context===undefined) return;
      if(context.on === Backbone.Events.on){
        self.listenTo(context,'change:'+path[i],function(){
          self.unbindEvents();
          self.bindEvents();
          self.update();
        });
      }
      context = context[attr] || (_.isFunction(context['get']) ? context.get(attr) : undefined);
    });
  },
  bindEvents:function(){
    this.listenDeep();
    this.listenTo(this.view,'close',this.unbindEvents,this);
  },
  unbindEvents:function(){
    this.stopListening();
    this.off();
  },
  update:function(){
    this.metamorph.html(this.decorator(this.value()));
  }
},Backbone.Events);