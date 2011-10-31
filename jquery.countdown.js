/*!
 * jQuery Countdown plugin v0.1
 *
 * http://www.acwid.net/blog
 *
 * Copyright 2011, hylwrcool@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

$.fn.countDown = function(options) {
    var _this = this;
    var defaults = {
        'year': 2020,
        'month': 1,
        'day': 1,
        'hour': 1,
        'minute': 1,
        'second': 1,
        'overText': 'Count Down Over!',
        'format' : 'dd days hh hours mm minutes ss seconds' 
    };
    var opts = $.extend(defaults, options);
    
    var countDownDate = new Date();
    countDownDate.setDate(1); //必须先将日期设置成1，否则某些31号的时候，再设置月份的时候，对于该月只有30天的话，会自动跳到下一个月
    countDownDate.setYear(opts.year);
    countDownDate.setMonth(opts.month - 1);
    countDownDate.setDate(opts.day);
    countDownDate.setHours(opts.hour);
    countDownDate.setMinutes(opts.minute);
    countDownDate.setSeconds(opts.second);
    this.countDownTime = Math.floor(countDownDate.getTime()/1000);
    
    
    this._opts = opts;

    this.beginCountDown = function() {
        
        var nowDate = new Date();
        var nowTime = Math.floor(nowDate.getTime()/1000);

        var interval = _this.countDownTime - nowTime;
        if (interval <= 0) {
            $(this).html(_this._opts.overText);
            return;
        }
    
        var day = Math.floor(interval/(3600*24));
        var hour = Math.floor((interval%(3600*24))/3600);
        var minute = Math.floor((interval%(3600)/60));
        var second = Math.floor((interval%60));

        var format = _this._opts.format;
        format = format.replace('dd', day).replace('hh', hour).replace('mm', minute).replace('ss', second);
        $(_this).html(format);
    }
    
    setInterval(this.beginCountDown, 1000);

}
