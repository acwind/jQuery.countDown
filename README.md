# jQuery Countdown

[简体中文](./README.zh-CN.md) · [Live demo][demo]

A lightweight jQuery plugin for counting down to a target date. It displays the remaining days, hours, minutes, and seconds immediately, then shows a completion message and stops the timer when the target time arrives.

In the demo, pick a preset or enter a duration in seconds to try starting, restarting, and stopping the timer. To run the demo from a local clone, open `demo/index.html` in your browser.

## Quick start

Save the plugin as `jquery.countdown.js`. Create an `index.html` file in the same directory, paste the example below, and open the page in a browser. [Plugin source](./jquery.countdown.js)

The example loads jQuery 3.7.1 from the official CDN and starts a five-minute countdown when the page opens. [jQuery CDN](https://releases.jquery.com/jquery/)

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Five-minute countdown</title>
</head>
<body>
    <h1>Five-minute countdown</h1>
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
            format: "dd days hh hours mm minutes ss seconds",
            overText: "Time's up!"
        });
    </script>
</body>
</html>
```

To add the plugin to an existing page, load jQuery first and then `jquery.countdown.js`. Once the target element is in the DOM, call `$(selector).countDown(options)`. Change `5 * 60 * 1000` in the example to set a different duration in milliseconds.

## Examples

### Run an action when the timer ends

This example counts down to January 1, 2030 at 09:00:00 in the browser's local time zone. When the timer ends, it enables the sign-up button. Set the date and time to match your event.

```html
<p id="event-counter" role="timer"></p>
<button id="signup-button" type="button" disabled>Sign up</button>
```

```javascript
$("#event-counter").countDown({
    year: 2030,
    month: 1,
    day: 1,
    hour: 9,
    minute: 0,
    second: 0,
    format: "Starts in dd days hh hours mm minutes ss seconds",
    overText: "Registration is open",
    onComplete: function() {
        $(this).addClass("is-finished");
        $("#signup-button").prop("disabled", false);
    }
});
```

The plugin first displays `overText`, then runs `onComplete` once per finished element. Inside the callback, `this` is the current DOM element. If the target time has already arrived during initialization, both steps happen immediately.

### Start multiple timers and stop one independently

Give multiple elements the `countdown` class to initialize them together. Each element has its own timer, so you can stop one with a more specific selector.

```html
<p class="countdown" id="main-counter" role="timer"></p>
<p class="countdown" id="sidebar-counter" role="timer"></p>
```

```javascript
$(".countdown").countDown({
    year: 2030, month: 1, day: 1,
    hour: 9, minute: 0, second: 0
});

$("#sidebar-counter").countDown("destroy").text("Countdown stopped");
```

Initialization and `destroy` both return the current jQuery object, so you can chain methods such as `.text()` or `.addClass()`. Calling `countDown(options)` again on the same element replaces its current timer.

## Options

The browser interprets date and time options in the visitor's local time zone, with one-second precision. Set the date explicitly and use `0` for any time fields that should be zero.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `year` | Number | `2020` | Four-digit year |
| `month` | Number | `1` | Month from 1 to 12. Add 1 when using `Date#getMonth()` |
| `day` | Number | `1` | Day of the month |
| `hour` | Number | `1` | Hour from 0 to 23 |
| `minute` | Number | `1` | Minute from 0 to 59 |
| `second` | Number | `1` | Second from 0 to 59 |
| `format` | String | `dd days hh hours mm minutes ss seconds` | Countdown display template |
| `overText` | String | `Count Down Over!` | Content displayed when the timer ends |
| `onComplete` | Function | `null` | Optional callback when the timer ends |

### Display format

For example, `dd days hh hours mm minutes ss seconds` can display as `2 days 3 hours 4 minutes 5 seconds`. The first occurrence of each token is replaced with an unpadded integer.

| Token | Meaning |
| --- | --- |
| `dd` | Whole days remaining |
| `hh` | Hours after whole days, 0–23 |
| `mm` | Minutes after whole hours, 0–59 |
| `ss` | Seconds after whole minutes, 0–59 |

## Troubleshooting

**The page shows the completion message immediately**

Check that the target date is still in the future, including the year and month. The default year is `2020`, so leaving it unset makes the timer end immediately.

**`$(...).countDown is not a function`**

Check that jQuery loads before `jquery.countdown.js` and that the method name uses a capital `D`.

**The countdown is missing from the page**

Check that the selector matches the target element. For example, `$("#counter").length` should be `1` for the quick-start example. Place the initialization script after the target element or call it inside `$(function() { ... })`.

## License

MIT License. [Full license text](./jquery.countdown.js#L1-L25)

[demo]: https://livecodes.io/?x=https%3A%2F%2Fraw.githubusercontent.com%2Facwind%2FjQuery.countDown%2Fe601f2afce6346232b88ecee391fdf25d800dc21%2Fdemo%2Findex.html&raw=html&mode=result&head=%3Cmeta+charset%3D%22utf-8%22%3E%3Cmeta+name%3D%22viewport%22+content%3D%22width%3Ddevice-width%2C+initial-scale%3D1%22%3E%3Cbase+href%3D%22https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Facwind%2FjQuery.countDown%40e601f2afce6346232b88ecee391fdf25d800dc21%2Fdemo%2F%22%3E&title=jQuery+Countdown+demo&welcome=false
