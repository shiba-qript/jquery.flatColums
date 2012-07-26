/*!
* jQuery.tabNavigator
*
* @version beta
* @author Kazuhito Shiba <kazuhito_shiba@qript.co.jp>
*/

(function($){

$.fn.flatColumns = function(options){
	var opt = options ? options : {};
	this.each(function(){
		return new $.FlatColumns(this,opt);
	});
};

$.FlatColumns = function(_this,opt){
	var self = this;
	this.$elem = $(_this);
	this.setting = $.extend({
		'target' : false,
		'column' : -1
	},opt);
	this.$target = this.setting.target ? this.$elem.find(self.setting.target) : this.$elem.children();
	this.init();
};

$.FlatColumns.prototype = {
	init : function(){
		var self = this;
		this.isSet = false;
		this.group = [];
		this.tmp = [];
		this._slice();
		this.send();
	},
	_slice : function(){
		var self = this;
		var num = this.setting.column;
		
		self.$target.each(function(i){
			if( num ){
				self.isSet = (i+1)%num == 0 && (i+1)/num > 0;
			};
			self.tmp.push($(this));
			if( self.isSet ){
				self.group.push(self.tmp);
				self.tmp = [];
			};
		});
		if(this.tmp.length){
			this.group.push(this.tmp);
		};
	},
	send : function(){
		$.flatCore.flat(this.group);
		$.flatCore.observer.monitor(this.group);
	}
};

$.flatCore = {
	flat : function(group){
		var size = group.length;
		for( i=0; i<size; ++i ){
			var _max = 0;
			$(group[i]).each(function(){
				var _h = $(this).innerHeight();
				if( _h > _max ){
					_max = _h;
				};
			}).height(_max);
		};
	},
	reFlat : function(group){
		var size = group.length;
		//console.log(group.length)
		for( j=0;  j<size; ++j ){
			$(group[j]).height('auto');
		};
		this.flat(group);
	},
	observer : {
		$elem : $('<div id="observer" />').text('observer').css({
			'position':'absolute',
			'top':'-9999px',
			'left':'-9999px'
		}),
		init : function(){
			var $base = $('#contents').length ? $('#contents') : $('body');
			$base.append($.flatCore.observer.$elem);
			this._size = $('#observer').height();
			this.keep = [];
		},
		monitor : function(group){
			this.keep.push(group);
			var self = this;
			setInterval(function(){
				if(self.isChange()){
					var size = self.keep.length;
					for( k=0; k<size; ++k ){
						$.flatCore.reFlat(self.keep[k]);
					};
				}
			},500);
		},
		isChange : function(){
			var $obj = $('#observer');
			var _size = $obj.height();
			if(this._size == _size){
				return false;
			}else{
				this._size = _size;
				return true;
			}
		}
	}
}

$.flatCore.observer.init();

})(jQuery);
