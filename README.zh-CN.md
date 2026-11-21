# jQuery Countdown

[English](./README.md) · [在线演示][demo]

一个用于网页的轻量级 jQuery 倒计时插件。为元素指定目标时间后，插件会立即显示剩余的天、小时、分钟和秒，到期后自动更新结束文案并停止计时。

在演示中可选择快捷时长或输入秒数，体验开始、重新开始、手动停止和到期。克隆仓库后，也可以在浏览器中打开 `demo/index.html`。

## 快速开始

将插件文件保存为 `jquery.countdown.js`，在同一目录创建 `index.html` 并粘贴下面的代码，然后用浏览器打开页面。 [插件源码](./jquery.countdown.js)

示例从官方 CDN 加载 jQuery 3.7.1，并从页面打开时起倒计时 5 分钟。 [jQuery 官方 CDN](https://releases.jquery.com/jquery/)

```html
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>五分钟倒计时</title>
</head>
<body>
    <h1>五分钟倒计时</h1>
    <p id="counter" role="timer"></p>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
            crossorigin="anonymous"></script>
    <script src="./jquery.countdown.js"></script>
    <script>
        var deadline = new Date(Date.now() + 5 * 60 * 1000);

        $("#counter").countDown({
            year: deadline.getFullYear(),
            month: deadline.getMonth() + 1,
            day: deadline.getDate(),
            hour: deadline.getHours(),
            minute: deadline.getMinutes(),
            second: deadline.getSeconds(),
            format: "dd 天 hh 小时 mm 分 ss 秒",
            overText: "倒计时结束"
        });
    </script>
</body>
</html>
```

接入已有页面时，先加载 jQuery，再加载 `jquery.countdown.js`，等目标元素进入 DOM 后调用 `$(selector).countDown(options)`。修改示例中的 `5 * 60 * 1000` 可以调整倒计时时长。

## 常用用法

### 在指定时间执行操作

下面的例子倒计时到浏览器本地时间 2030 年 1 月 1 日 09:00:00，到期后启用报名按钮。将日期和时间改成你的活动开始时间。

```html
<p id="event-counter" role="timer"></p>
<button id="signup-button" type="button" disabled>报名</button>
```

```javascript
$("#event-counter").countDown({
    year: 2030,
    month: 1,
    day: 1,
    hour: 9,
    minute: 0,
    second: 0,
    format: "距活动开始还有 dd 天 hh 小时 mm 分 ss 秒",
    overText: "报名已开放",
    onComplete: function() {
        $(this).addClass("is-finished");
        $("#signup-button").prop("disabled", false);
    }
});
```

插件先显示 `overText`，再为每个到期元素执行一次 `onComplete`。回调中的 `this` 指向当前 DOM 元素。如果初始化时目标时间已到，这两步会立即执行。

### 同时启动多个倒计时并单独停止

给多个元素添加 `countdown` 类即可一起初始化。每个元素独立计时，可以通过更具体的选择器停止其中一个。

```html
<p class="countdown" id="main-counter" role="timer"></p>
<p class="countdown" id="sidebar-counter" role="timer"></p>
```

```javascript
$(".countdown").countDown({
    year: 2030, month: 1, day: 1,
    hour: 9, minute: 0, second: 0
});

$("#sidebar-counter").countDown("destroy").text("倒计时已停止");
```

初始化和 `destroy` 都返回当前 jQuery 对象，可以继续调用 `.text()`、`.addClass()` 等方法。对同一元素再次调用 `countDown(options)` 会替换原来的计时器。

## 参数

日期选项按访问者浏览器的本地时间解释，精确到秒。请填写实际目标日期，时分秒可按需要设为 `0`。

| 参数 | 类型 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `year` | 数字 | `2020` | 年份，填写完整的四位年份 |
| `month` | 数字 | `1` | 月份，范围为 `1–12`。从 `Date#getMonth()` 取值时加 `1` |
| `day` | 数字 | `1` | 当月的第几天，按该月实际天数填写 |
| `hour` | 数字 | `1` | 小时，范围为 `0–23` |
| `minute` | 数字 | `1` | 分钟，范围为 `0–59` |
| `second` | 数字 | `1` | 秒，范围为 `0–59` |
| `format` | 字符串 | `dd days hh hours mm minutes ss seconds` | 倒计时显示模板 |
| `overText` | 字符串 | `Count Down Over!` | 到期后的显示内容 |
| `onComplete` | 函数 | `null` | 到期时执行的可选回调 |

### 显示格式

例如，`dd 天 hh 小时 mm 分 ss 秒` 可以显示为 `1 天 2 小时 3 分 4 秒`。每种占位符只替换第一次出现的位置，数值按整数显示。

| 占位符 | 含义 |
| --- | --- |
| `dd` | 剩余的整天数 |
| `hh` | 扣除整天后剩余的小时数，`0–23` |
| `mm` | 扣除整小时后剩余的分钟数，`0–59` |
| `ss` | 扣除整分钟后剩余的秒数，`0–59` |

## 常见问题

**一打开页面就显示结束**

确认目标时间仍在将来，并检查年份和月份。省略 `year` 时会使用默认值 `2020`，使倒计时立即结束。

**调用时报 `$(...).countDown is not a function`**

检查 jQuery 和 `jquery.countdown.js` 是否按顺序加载，以及方法名中的 `D` 是否大写。

**页面上没有显示倒计时**

检查选择器是否找到了目标元素，例如 `$("#counter").length` 应为 `1`。可以将初始化脚本放在目标元素之后，或在 `$(function() { ... })` 中调用。

## 许可证

MIT License。 [完整许可条款](./jquery.countdown.js#L1-L25)

[demo]: https://livecodes.io/?x=https%3A%2F%2Fraw.githubusercontent.com%2Facwind%2FjQuery.countDown%2Fce427c37e5793f3422c7aa98ed893fe1e8e445b0%2Fdemo%2Findex.html&raw=html&mode=result&head=%3Cmeta+charset%3D%22utf-8%22%3E%3Cmeta+name%3D%22viewport%22+content%3D%22width%3Ddevice-width%2C+initial-scale%3D1%22%3E%3Cmeta+name%3D%22countdown-language%22+content%3D%22zh-CN%22%3E%3Cbase+href%3D%22https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Facwind%2FjQuery.countDown%40ce427c37e5793f3422c7aa98ed893fe1e8e445b0%2Fdemo%2F%22%3E&title=jQuery+Countdown+demo&welcome=false
