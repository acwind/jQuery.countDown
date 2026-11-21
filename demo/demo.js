(function() {
    const chinese = new URLSearchParams(window.location.search).get("lang") === "zh-CN";
    const labels = chinese ? {
        title: "倒计时演示",
        docs: "使用文档",
        remaining: "剩余时间",
        duration: "时长",
        seconds: "秒",
        presets: "快捷时长",
        secondUnit: "秒",
        minuteUnit: "分钟",
        units: ["天", "小时", "分钟", "秒"],
        ready: "准备就绪",
        running: "倒计时中",
        stopped: "已停止",
        finished: "倒计时结束",
        error: "倒计时加载失败",
        start: "开始",
        restart: "重新开始",
        stop: "停止"
    } : {
        title: "Countdown demo",
        docs: "Docs",
        remaining: "Time remaining",
        duration: "Duration",
        seconds: "seconds",
        presets: "Quick durations",
        secondUnit: "sec",
        minuteUnit: "min",
        units: ["Days", "Hours", "Minutes", "Seconds"],
        ready: "Ready",
        running: "Running",
        stopped: "Stopped",
        finished: "Time’s up",
        error: "Timer unavailable",
        start: "Start",
        restart: "Restart",
        stop: "Stop"
    };

    document.documentElement.lang = chinese ? "zh-CN" : "en";
    document.title = labels.title + " | jQuery Countdown";
    for (const element of document.querySelectorAll("[data-label]")) {
        element.textContent = labels[element.dataset.label];
    }

    const language = document.getElementById("language");
    language.href = chinese ? "?lang=en" : "?lang=zh-CN";
    language.lang = chinese ? "en" : "zh-CN";
    language.hreflang = language.lang;
    language.textContent = chinese ? "English" : "简体中文";

    if (chinese) {
        document.getElementById("documentation").href += "/blob/master/README.zh-CN.md";
    }

    const monitor = document.getElementById("monitor");
    const status = document.getElementById("timer-status");
    const countdown = document.getElementById("countdown");
    const form = document.getElementById("controls");
    const duration = document.getElementById("duration");
    const presets = document.getElementById("presets");
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");

    presets.setAttribute("aria-label", labels.presets);
    for (const preset of presets.querySelectorAll("[data-seconds]")) {
        const seconds = Number(preset.dataset.seconds);
        preset.textContent = seconds < 60
            ? seconds + " " + labels.secondUnit
            : seconds / 60 + " " + labels.minuteUnit;
        preset.addEventListener("click", function() {
            duration.value = seconds;
        });
    }

    const format = ["dd", "hh", "mm", "ss"].map(function(token, index) {
        return "<div><strong>" + token + "</strong><span>" + labels.units[index] + "</span></div>";
    }).join("");
    const zeros = format.replace(/dd|hh|mm|ss/g, "0");
    countdown.innerHTML = zeros;

    function showState(state) {
        const running = state === "running";
        monitor.dataset.state = state;
        status.textContent = labels[state];
        start.textContent = running ? labels.restart : labels.start;
        stop.disabled = !running;
    }

    const $ = window.jQuery;
    if (!$ || typeof $.fn.countDown !== "function") {
        showState("error");
        return;
    }

    const $countdown = $(countdown);
    showState("ready");
    start.disabled = false;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const deadline = new Date(Date.now() + duration.valueAsNumber * 1000);

        showState("running");
        $countdown.countDown({
            year: deadline.getFullYear(),
            month: deadline.getMonth() + 1,
            day: deadline.getDate(),
            hour: deadline.getHours(),
            minute: deadline.getMinutes(),
            second: deadline.getSeconds(),
            format: format,
            overText: zeros,
            onComplete: function() {
                showState("finished");
            }
        });
    });

    stop.addEventListener("click", function() {
        $countdown.countDown("destroy");
        showState("stopped");
        start.focus();
    });
})();
