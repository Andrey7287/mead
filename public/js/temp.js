function PhonePattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    var str = this.$obj.val().replace(/[^0-9]/g, '');
    return str.length === 11;
  };
  this.toString = function () {
    return "PhonePattern";
  }
}


function MobilePhonePattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    var str = this.$obj.val().replace(/[^0-9]/g, '');
    return str.length === 11 && isCellPhone(str);
  };
  this.toString = function () {
    return "MobilePhonePattern";
  }
}

function EmailPattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    var EMAIL_PATTERN = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/i;
    if (this.$obj.val().replace(/\s+/g, '') !== '') {
      return (EMAIL_PATTERN.test(this.$obj.val()));
    } else {
      return false;
    }
  };
  this.toString = function () {
    return "EmailPattern";
  }
}

function TextPattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    return !!this.$obj.value;
  };
  this.toString = function () {
    return "TextPattern";
  }
}

function PasswordPattern(_min, _max) {
  var $obj;
  var min = _min;
  var max = _max;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    if (this.$obj.val().replace(/\s+/g, '').length < min || this.$obj.val().replace(/\s+/g, '').length > max) return false;
    var PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/i;
    if (this.$obj.val().replace(/\s+/g, '') !== '') {
      return (PASSWORD_PATTERN.test(this.$obj.val()));
    } else {
      return false;
    }
  };
  this.toString = function () {
    return "PasswordPattern";
  }
}

function NumberPattern(length) {
  var $obj;
  var req_length = length === undefined ? req_length = -1 : req_length = length;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    var str = this.$obj.val().replace(/[^0-9]/g, '');
    this.$obj.val(str);
    if (str.length > 0) {
      if (req_length === -1) {
        return true;
      } else {
        return str.length === req_length;
      }
    } else {
      return false;
    }

  };
  this.toString = function () {
    return "NumberPattern [" + req_length + "]";
  }
}


function SelectPattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    return this.$obj.val() && this.$obj.val() !== "";
  };
  this.toString = function () {
    return "SelectPattern";
  }
}

function NonZeroPattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    if (this.$obj.length < 1) return false;
    return this.$obj.val().replace(/\s+/g, '') !== 0;
  };
  this.toString = function () {
    return "NonZeroPattern";
  }
}

function RadioPattern() {
  var $obj;
  this.set = function ($obj) {
    this.$obj = $obj;
  };
  this.check = function () {
    return this.$obj.length > 0;
  };
  this.toString = function () {
    return "RadioPattern";
  }
}


function Validator($obj, pattern, alert_message) {
  this.$obj = $obj;
  pattern === undefined ? this.pattern = new TextPattern() : this.pattern = pattern;
  alert_message === undefined ? this.alert_message = '' : this.alert_message = alert_message;

  this.validate = function () {
    pattern.set(this.$obj);
    if (pattern.check()) {
      this.$obj.css('background-color', 'green');
      return true;
    } else {
      this.$obj.css('background-color', 'red');
      if (!this.$obj[0].value.trim()) {
        console.log("!")
        //this.$obj.val("")

      };
      if (this.alert_message !== '') alert(this.alert_message);
      this.$obj.focus();
      return false;
    }
  };
  this.toString = function () {
    return "pattern type: " + this.pattern.toString() + ", object: " + this.$obj.length + ", message: " + this.alert_message;
  };
  this.val = function () {
    return this.$obj.val();
  }

}

Код конструктора 

function Validator() {

  //Инкапсуляция приватных методов
  var patterns = {
    email: function (el) {
      // проверка переданного элемента на соответствие паттерну email
    },
    pass : function (el) {
      // проверка переданного элемента на соответствие паттерну password
    },
    default : function (el) {
      // проверка по умолчанию
    }
  };

  // публичный метод 
  this.validate = function (el, pattern) {

    if (!el) return console.warn('Theres is no element for validation!');

    pattern in patterns ? patterns[pattern](el) : patterns.default(el)
  }
  //сеттер позволяющий добавлять паттерны для проверки тоже не помешает
  Object.defineProperty(this, "addPattern", {
    set: function(obj) {
      patterns[obj.name] = obj.fn;
    }
  });
  
}

Этот код мы могли бы вынести в отдельный файл и подключать в проект по необходимости. Все сборшики проектов написаны на Ноде по этому модули работают без подключения дополнительных библиотек. 

//Подключаем модуль к проекту
var validator = require('./modules/validator')();

//Проверка на соответствие паттерну 'email' 
validator.validate('selector', 'email');

//Проверка по умолчанию
validator.validate('selector');

//Добавление нового паттерна
var newPattern = {
  name: 'color',
  fn: function(el){
    //code
  }
};
validator.addPattern = newPattern;
validator.validate('selector', 'color');
