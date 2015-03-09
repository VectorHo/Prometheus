var _ = require('underscore');

module.exports = (function() {

	var validator = function(){};


	/**
	 * 主要实现的功能是：判断 inputKeys 是否在 canInputKeysArray 中，如果不在，则返回提示信息
	 * @method keyDifference
	 * @for validator
	 * @param {object} _this 那个函数调用这个函数
	 * @param {String} inputKeys 传入的字符串
   * @param {Array} canInputKeysArray 用户可以输入的字符串数组
	 * @return {body} 返回提示
	 */
  validator.prototype.keyDifference = function(_this, inputKeys, canInputKeysArray) {
    var keys = _.difference(_.keys(inputKeys), canInputKeysArray);
		console.log(keys);
    if (0 != keys.length) {
      _this.status = 400;
			throw new Error("Only the following options: " + canInputKeysArray.toString())
    }
	};


	/**
	* 该函数主要是对枚举进行检测，检测 needValidator 在 canInputEnumArray 中是否存在相应的枚举
	* @method enumValidator
	*	@for validator
	* @param {object}	_this	指向调用的函数
	*	@param {String}	needValidator	需要验证的字符串
	* @param {Array}	canInputEnumArray	符合规则的字符串数组
	*	@return {body}	返回错误提示
	*/
  validator.prototype.enumValidator = function(_this, needValidator, canInputEnumArray){
    _this.checkQuery(needValidator).empty().in(canInputEnumArray, "Only the following options:" + canInputEnumArray.toString());
    if (_this.errors) {
			_this.status = 400;
			throw new Error(JSON.stringify(_this.errors[0]));
    }
  };


	return new validator();
})();
