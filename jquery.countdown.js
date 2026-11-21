/*!
 * jQuery Countdown plugin v0.1
 *
 * https://blog.acwinds.com
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

(function($) {
    var stateKey = 'countDownState';

    function stopCountDown(element) {
        var state = $.data(element, stateKey);
        if (!state) {
            return;
        }

        // clone(true) 可能复制倒计时状态，只有原元素可以取消该计时器。
        if (state.element === element) {
            clearTimeout(state.timeoutId);
        }
        $.removeData(element, stateKey);
    }

    $.fn.countDown = function(options) {
        if (options === 'destroy') {
            return this.each(function() {
                stopCountDown(this);
            });
        }

        var opts = $.extend({
            year: 2020,
            month: 1,
            day: 1,
            hour: 1,
            minute: 1,
            second: 1,
            overText: 'Count Down Over!',
            format: 'dd days hh hours mm minutes ss seconds',
            onComplete: null
        }, options);
        var targetTime = new Date(
            opts.year, opts.month - 1, opts.day, opts.hour, opts.minute, opts.second
        ).getTime();

        return this.each(function() {
            var element = this;
            var $element = $(element);
            var state = { element: element, timeoutId: null };

            stopCountDown(element);
            $.data(element, stateKey, state);

            function update() {
                if ($.data(element, stateKey) !== state) {
                    return;
                }

                var remainingMilliseconds = targetTime - new Date().getTime();
                if (remainingMilliseconds > 0) {
                    var remainingSeconds = Math.ceil(remainingMilliseconds / 1000);
                    var days = Math.floor(remainingSeconds / 86400);
                    var hours = Math.floor(remainingSeconds % 86400 / 3600);
                    var minutes = Math.floor(remainingSeconds % 3600 / 60);
                    var seconds = remainingSeconds % 60;
                    var format = opts.format.replace('dd', days).replace('hh', hours)
                        .replace('mm', minutes).replace('ss', seconds);

                    // 在剩余秒数即将变化时刷新，避免沿用启动时的毫秒偏移。
                    state.timeoutId = setTimeout(update, remainingMilliseconds % 1000 || 1000);
                    $element.html(format);
                    return;
                }

                stopCountDown(element);
                $element.html(opts.overText);
                if (remainingMilliseconds <= 0 && typeof opts.onComplete === 'function') {
                    opts.onComplete.call(element);
                }
            }

            update();
        });
    };
})(jQuery);
