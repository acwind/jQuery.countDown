(function() {
    const labels = {
        "zh-CN": {
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
        },
        en: {
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
        }
    };

    const monitor = document.getElementById("monitor");
    const status = document.getElementById("timer-status");
    const countdown = document.getElementById("countdown");
    const form = document.getElementById("controls");
    const duration = document.getElementById("duration");
    const presets = document.getElementById("presets");
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");
    const documentation = document.getElementById("documentation");
    const languageToggle = document.getElementById("language");
    const repository = documentation.href;
    const shortcutButtons = presets.querySelectorAll("[data-seconds]");
    const translatable = document.querySelectorAll("[data-label]");
    let locale = "en";

    const format = ["dd", "hh", "mm", "ss"].map(function(token, index) {
        return "<div><strong>" + token + "</strong>"
            + '<span lang="en">' + labels.en.units[index] + "</span>"
            + '<span lang="zh-CN">' + labels["zh-CN"].units[index] + "</span></div>";
    }).join("");
    const zeros = format.replace(/dd|hh|mm|ss/g, "0");
    countdown.innerHTML = zeros;

    function showState(state) {
        const text = labels[locale];
        const running = state === "running";
        monitor.dataset.state = state;
        status.textContent = text[state];
        start.textContent = running ? text.restart : text.start;
        stop.disabled = !running;
    }

    function showLanguage(language) {
        locale = language === "zh-CN" ? "zh-CN" : "en";
        const text = labels[locale];
        const chinese = locale === "zh-CN";

        document.documentElement.lang = locale;
        document.title = text.title + " | jQuery Countdown";
        for (const element of translatable) {
            element.textContent = text[element.dataset.label];
        }

        languageToggle.lang = chinese ? "en" : "zh-CN";
        languageToggle.textContent = chinese ? "English" : "简体中文";
        documentation.href = chinese ? repository + "/blob/master/README.zh-CN.md" : repository;
        presets.setAttribute("aria-label", text.presets);

        for (const button of shortcutButtons) {
            const seconds = Number(button.dataset.seconds);
            button.textContent = seconds < 60
                ? seconds + " " + text.secondUnit
                : seconds / 60 + " " + text.minuteUnit;
        }

        showState(monitor.dataset.state || "ready");
    }

    const defaultLanguage = document.querySelector('meta[name="countdown-language"]');
    const queryLanguage = new URLSearchParams(window.location.search).get("lang");
    showLanguage(queryLanguage || (defaultLanguage && defaultLanguage.content));
    languageToggle.addEventListener("click", function() {
        showLanguage(languageToggle.lang);
    });

    const $ = window.jQuery;
    if (!$ || typeof $.fn.countDown !== "function") {
        showState("error");
        return;
    }

    const $countdown = $(countdown);
    start.disabled = false;

    for (const button of shortcutButtons) {
        button.addEventListener("click", function() {
            duration.value = button.dataset.seconds;
        });
    }

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
