Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[0].length || 0; 
}

function getRandomIntInclusive(e, t) {
    return e = Math.ceil(e), t = Math.floor(t), Math.floor(Math.random() * (t - e + 1)) + e
}

function scrollToTop() {
    $("html, body").animate({
        scrollTop: 0
    }, 500)
}

function renderStats(e) {
    $("#worker-" + window.prev_worker).removeClass("selected"), "" != e ? (scrollToTop(), $("#worker-" + e).addClass("selected"), $("#worker-header .name").html(e), $("#worker-header").show(), $("#worker-header").css("visibility", "visible"), $("#worker-header .name").show(), $("#worker-header").animate({
        height: 100
    }, 500)) : "" != window.prev_worker && $("#worker-header").animate({
        height: 0
    }, 500, (function() {
        $("#worker-header").hide()
    })), window.prev_worker = e, renderHeader(e), url = "" == e ? `https://flexpool.io/api/v1/miner/${window.wallet}/chart` : `https://flexpool.io/api/v1/worker/${window.wallet}/${e}/chart`, $.get(url, {}, (function(e) {
        effective_hashrate_chartdata = [], reported_hashrate_chartdata = [], average_effective_hashrate_chartdata = [], valid_shares_chartdata = [], stale_shares_chartdata = [], invalid_shares_chartdata = [], data = e.result, effective_hashrate_avg = [], data.forEach((function(e, t) {
            0 != e.effective_hashrate && effective_hashrate_avg.push(e.effective_hashrate)
        })), effective_hashrate_avg = arrAvg(effective_hashrate_avg), si = getSi(effective_hashrate_avg), window.chart_hasrate_si = si[1], data.forEach((function(e, t) {
            effective_hashrate_chartdata.push([1e3 * e.timestamp, e.effective_hashrate / si[0]]), reported_hashrate_chartdata.push([1e3 * e.timestamp, e.reported_hashrate / si[0]]), average_effective_hashrate_chartdata.push([1e3 * e.timestamp, e.average_effective_hashrate / si[0]]), valid_shares_chartdata.push([1e3 * e.timestamp, e.valid_shares]), stale_shares_chartdata.push([1e3 * e.timestamp, e.stale_shares]), invalid_shares_chartdata.push([1e3 * e.timestamp, e.invalid_shares])
        })), avg_effective_data_12h = [], avg_effective_data_6h = [], effective_hashrate_chartdata.forEach((function(e, t) {
            t <= 36 && avg_effective_data_6h.push(e[1]), t <= 72 && avg_effective_data_12h.push(e[1])
        })), avg_effective_12h = avg_effective_data_12h.reduce(((e, t) => e + t), 0) / avg_effective_data_12h.length, avg_effective_6h = avg_effective_data_6h.reduce(((e, t) => e + t), 0) / avg_effective_data_6h.length, $("#12h-avg-hashrate").html(`${Math.round(10*avg_effective_12h)/10} ${window.chart_hasrate_si}H/s`), $("#6h-avg-hashrate").html(`${Math.round(10*avg_effective_6h)/10} ${window.chart_hasrate_si}H/s`), renderStatsCharts(effective_hashrate_chartdata, reported_hashrate_chartdata, average_effective_hashrate_chartdata, valid_shares_chartdata, stale_shares_chartdata, invalid_shares_chartdata)
    }))
}

function renderHeader(e) {
    url = "" == e ? `https://flexpool.io/api/v1/miner/${window.wallet}/stats/` : `https://flexpool.io/api/v1/worker/${window.wallet}/${e}/stats/`, $.get(url, {}, (function(e) {
        data = e.result, effective_hashrate = sif(data.current.effective_hashrate), average_effective = sif(data.daily.effective_hashrate), reported_hashrate = sif(data.current.reported_hashrate), $("#effective_hashrate").html(`<mark class="big">${effective_hashrate[0]}</mark> ${effective_hashrate[1]}H/s`), $("#average_hashrate").html(`<mark class="big">${average_effective[0]}</mark> ${average_effective[1]}H/s`), $("#reported_hashrate").html(`<mark class="big">${reported_hashrate[0]}</mark> ${reported_hashrate[1]}H/s`), valid_shares = data.daily.valid_shares, stale_shares = data.daily.stale_shares, invalid_shares = data.daily.invalid_shares, $("#valid_shares").html(`<mark class="big">${valid_shares}</mark>`), $("#stale_shares").html(`<mark class="big">${stale_shares}</mark>`), $("#invalid_shares").html(`<mark class="big">${invalid_shares}</mark>`), total_shares = valid_shares + stale_shares + invalid_shares, total_shares > 0 && (fdata = Math.round(valid_shares / total_shares * 1e4) / 100, isNaN(fdata) || $("#valid_shares_percentage").html(fdata), fdata = Math.round(valid_shares / total_shares * 1e3) / 10, isNaN(fdata) || $("#valid_shares_percentage_big").html(fdata), fdata = Math.round(stale_shares / total_shares * 1e3) / 10, isNaN(fdata) || $("#stale_shares_percentage").html(fdata), fdata = Math.round(invalid_shares / total_shares * 1e3) / 10, isNaN(fdata) || $("#invalid_shares_percentage").html(fdata))
	,$("#effective_hashrate2").html($("#effective_hashrate").html())
	,$("#average_hashrate2").html($("#average_hashrate").html())
	,$("#reported_hashrate2").html($("#reported_hashrate").html())
	,$("#valid_shares2").html($("#valid_shares").html())
	,$("#stale_shares2").html($("#stale_shares").html())
	,$("#invalid_shares2").html($("#invalid_shares").html())
	,$("#valid_shares_percentage2").html($("#valid_shares_percentage").html())
	,$("#stale_shares_percentage2").html($("#stale_shares_percentage").html())
	,$("#invalid_shares_percentage2").html($("#invalid_shares_percentage").html())
    }))
}

function renderPaymentsData(e) {
    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/totalPaid`, {}, (function(t) {
        totalPaid = t.result / Math.pow(10, 18), $(".total-paid").html(/*Math.round*/((100 * totalPaid) / 100).toFixed(4)), $(".total-paid-usd").html(formatMoney(totalPaid * e))
    })).fail((function(e) {
        console.error("Unable to get total paid", e)
    })), $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/totalDonated`, {}, (function(t) {
        totalDonated = t.result / Math.pow(10, 18), $(".total-donated").html(/*Math.round*/((100 * totalDonated) / 100).toFixed(4)), $(".total-donated-usd").html(formatMoney(totalDonated * e))
    })).fail((function(e) {
        console.error("Unable to get total donated", e)
    })), $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/paymentCount`, {}, (function(e) {
        $(".total-payouts").html(e.result)
    }))
}

function render_payments(e) {
    renderPagedTable("payments", "https://flexpool.io/api/v1/miner/" + window.wallet + "/payments", {}, e, "render_payments", paymentsTableDataFilter)
}

function render_payments_chart() {
    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/paymentsChart`, {}, (function(e) {
        data = e.result, chart_data = [], data.forEach((function(e, t) {
            chart_data.push([1e3 * e.timestamp, e.amount / Math.pow(10, 18)])
        })), chart_data.reverse(), renderPayoutChart(chart_data)
    }))
}

function renderBlocksData() {
    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/blockCount`, {}, (function(e) {
        $("#blocks-mined").html(e.result)
    })).fail((function(e) {
        console.error("Unable to load block count", e)
    }))
}

function render_blocks(e) {
    renderPagedTable("blocks", "https://flexpool.io/api/v1/miner/" + window.wallet + "/blocks", {}, e, "render_blocks", blocksTableDataFilter)
}

function switchView(e) {
    switch ("stats" != e && $("#worker-header").css({
            height: 0
        }), e) {
        case "stats":
            window.hasLoadedStats || (renderStats(""), window.hasLoadedStats = !0);
            break;
        case "payouts":
            window.hasLoadedPayouts || (render_payments_chart(), getEthPrice(renderPaymentsData), render_payments(1), window.hasLoadedPayouts = !0);
            break;
        case "blocks":
            window.hasLoadedBlocks || (renderBlocksData(), render_blocks(1), window.hasLoadedBlocks = !0)
    }
    $("#" + window.activeView).hide(), $("#" + window.activeView + "-selector").removeClass("selector-selected"), $("#" + e).show(), $("#" + e + "-selector").addClass("selector-selected"), window.activeView = e, "stats" == e ? history.pushState("", document.title, window.location.pathname + window.location.search) : (window.ignoreHashChange = !0, window.location.hash = "dashboard-" + e)
}

function renderStatsCharts(e, t, a, s, i, n) {
    $("#hashrates-chart").highcharts({
        chart: {
            styledMode: !0,
            type: "spline"
        },
        title: {
            text: _("Hashrate")
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b",
                year: "%b"
            },
            title: {
                text: _("Date")
            }
        },
        yAxis: {
            title: {
                text: _("Hashrates")
            },
            min: 0
        },
        tooltip: {
            headerFormat: "<b>{series.name}</b><br>",
            pointFormat: `{point.x:%e. %b %H:%M}: {point.y:.2f} ${window.chart_hasrate_si}H/s`
        },
        time: {
            timezoneOffset: (new Date).getTimezoneOffset()
        },
        series: [{
            name: _("Effective Hashrate"),
            className: "highcharts-color-effective-hashrate",
            data: highchartsSort(e)
        }, {
            name: _("Reported Hashrate"),
            className: "highcharts-color-reported-hashrate",
            data: highchartsSort(t)
        }, {
            name: _("Average E. Hashrate"),
            className: "highcharts-color-average-effective-hashrate",
            data: highchartsSort(a)
        }]
    }), $("#shares-chart").highcharts({
        chart: {
            styledMode: !0,
            type: "column"
        },
        title: {
            text: _("Shares")
        },
        yAxis: {
            title: {
                text: _("Shares")
            },
            min: 0
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b",
                year: "%b"
            },
            title: {
                text: _("Date")
            }
        },
        tooltip: {
            headerFormat: "<b>{series.name}</b><br>",
            pointFormat: "{point.x:%e. %b %H:%M}: {point.y} Shares"
        },
        time: {
            timezoneOffset: (new Date).getTimezoneOffset()
        },
        series: [{
            name: _("Valid shares"),
            className: "highcharts-color-valid-shares",
            data: highchartsSort(s)
        }, {
            name: _("Stale shares"),
            className: "highcharts-color-stale-shares",
            data: highchartsSort(i)
        }, {
            name: _("Invalid shares"),
            className: "highcharts-color-invalid-shares",
            data: highchartsSort(n)
        }]
    })
}

function renderPayoutChart(e) {
    $("#payouts-chart").highcharts({
        chart: {
            styledMode: !0,
            type: "column"
        },
        title: {
            text: _("Payments")
        },
        yAxis: {
            title: {
                text: _("Ether")
            },
            min: 0
        },
        xAxis: {
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b",
                year: "%b"
            },
            title: {
                text: _("Date")
            }
        },
        tooltip: {
            headerFormat: "<b>{series.name}</b><br>",
            pointFormat: "{point.x:%e. %b %H:%M}: {point.y:.4f} ETH"
        },
        time: {
            timezoneOffset: (new Date).getTimezoneOffset()
        },
        series: [{
            name: _("Ether"),
            className: "highcharts-color-payments",
            data: e
        }]
    })
}

function applySettings() {
    err = !1, minPayoutThreshold = $("#settings_min_payout_threshold").val(), maxFeePrice = $("#settings_gas_price_limit").val(), email = $("#settings-email").val(), "" == maxFeePrice && (maxFeePrice = 0), ip = $("#settings-ip").val().replaceAll(" ", ""), validateIP(ip) ? $("#settings-ip").removeClass("invalid-field") : ($("#settings-ip").addClass("invalid-field"), err = !0), err || (modalSettingsDisplayWindow("settings-loading-window"), $.post("/m/api/set_settings", {
        minPayoutThreshold: minPayoutThreshold,
        email: email,
        ip: ip,
        wallet: wallet,
        maxFeePrice: maxFeePrice,
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
    }, (function(e) {
        "true" == e ? ("" != email && $("#confirmation-sent").show(), modalSettingsDisplayWindow("settings-success-window")) : "Invalid IP" == e ? ($("#settings-ip").addClass("invalid-field"), modalSettingsDisplayWindow("next-step-window")) : ($("#settings-err-msg").html(e), modalSettingsDisplayWindow("settings-error-window"))
    })).fail((function(e) {
        $("#settings-err-msg").html(_("Request failed")), modalSettingsDisplayWindow("settings-error-window")
    })))
}

function nextStepSettings() {
    err = !1, minPayoutThreshold = $("#settings_min_payout_threshold").val(), minPayoutThreshold < .05 || minPayoutThreshold > 100 ? ($("#settings_min_payout_threshold").addClass("invalid-field"), err = !0) : $("#settings_min_payout_threshold").removeClass("invalid-field"), email = $("#settings-email").val(), "" != email && (validateEmail(email) ? $("#settings-email").removeClass("invalid-field") : ($("#settings-email").addClass("invalid-field"), err = !0)), err || modalSettingsDisplayWindow("next-step-window"), $("#settings-ip").select()
}

function openSettings() {
    modalSettingsDisplayWindow("settings-option-window"), bg = $(".settings-modal-bg"), modal = $(".settings-modal"), modal.css({
        "margin-bottom": 200,
        opacity: 0
    }), bg.css({
        opacity: 0
    }), bg.css("visibility", "visible"), modal.animate({
        "margin-bottom": 0,
        opacity: 1
    }, 400), bg.animate({
        opacity: 1
    }), window.settingsOpened = !0
}

function closeSettings() {
    window.settingsOpened = !1, bg = $(".settings-modal-bg"), bg.css("visibility", "hidden"), modal.css({
        opacity: 0
    })
}

function modalSettingsDisplayWindow(e) {
    window.settingsWindows.forEach((function(t, a) {
        t != e && $("#" + t).hide()
    })), $("#" + e).show()
}

function fragmentChanged() {
    if (fragment = window.location.hash.substr(1), "" != fragment || void 0 === window.activeView) switch (fragment) {
        case "dashboard-payouts":
            switchView("payouts");
            break;
        case "dashboard-blocks":
            if (window.isPro) {
                switchView("blocks");
                break
            }
            default:
                switchView("stats")
    }
}

function getPoolDonationChallenge(e, t, a) {
    address = window.wallet, $.post("/m/api/get_pool_donation_challenge", {
        address: address,
        donation: e,
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
    }, (function(e) {
        t(e)
    })).fail((function() {
        a()
    }))
}

function applyPoolDonationChange(e, t, a) {
    e = JSON.stringify(e), $.post("/m/api/apply_pool_donation", {
        sig: e,
        csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val()
    }, (function(e) {
        "OK" == e ? t() : a(e)
    })).fail((function() {
        a("Unknown Error")
    }))
}

function openSettingsEthSigWindow() {
    modalSettingsDisplayWindow("settings-loading-window"), address = window.wallet, $("#settings-donation").removeClass("invalid-field");
    try {
        donation = parseFloat($("#settings-donation").val()) / 100
    } catch {
        return void $("#settings-donation").addClass("invalid-field")
    }
    donation < 0 || donation > 1 ? $("#settings-donation").addClass("invalid-field") : getPoolDonationChallenge(donation, (function(e) {
        $("#settings-ethereum-sign-challenge").val(e), modalSettingsDisplayWindow("settings-sign-window")
    }), (function() {
        $("#settings-err-msg").html('Cannot obtain signing challenge.<br><span class="bluegray">If this happens frequently, please contact us.</span>'), modalSettingsDisplayWindow("settings-error-window")
    }))
}

function inputPoolDonation() {
    modalSettingsDisplayWindow("settings-pool-donation-window"), $("#settings-donation").select()
}

function attemptMetamaskSignature() {
    donation = parseFloat($("#settings-donation").val()) / 100, getPoolDonationChallenge(donation, (function(e) {
        metamaskSign(e, (function(e) {
            applyPoolDonationChange(e, (function() {
                successDonation()
            }), (function(e) {
                alert(e)
            }))
        }))
    }), (function() {
        $("#settings-err-msg").html('Cannot obtain signing challenge.<br><span class="bluegray">If this happens frequently, please contact us.</span>'), modalSettingsDisplayWindow("settings-error-window")
    }))
}

function openESNotice(e) {
    if ("" != $("#settings-donation").val()) {
        if ($("#settings-donation").removeClass("invalid-field"), window.isFreeloader = !1, donation = parseFloat($("#settings-donation").val()), donation < .5) {
            if (!e) return void modalSettingsDisplayWindow("settings-freeloader-notice-window");
            $("#what-is-digital-signature-modal-lower-text").hide(), $("#back-modal-lower-text").show()
        } else $("#back-modal-lower-text").hide(), $("#what-is-digital-signature-modal-lower-text").show();
        modalSettingsDisplayWindow("settings-es-notice-window")
    } else $("#settings-donation").addClass("invalid-field")
}

function metamaskSign(e, t) {
    modalSettingsDisplayWindow("settings-loading-window"), ethereum.enable().then((function(a) {
        if (!a.includes(window.wallet.toLowerCase())) return $("#settings-err-msg").html('<span>Seems like you haven\'t got needed address in metamask.</span><span>Try using <a onclick="openSettingsEthSigWindow();">alternative signing way</a>.</span>'), void modalSettingsDisplayWindow("settings-error-window");
        web3.currentProvider.sendAsync({
            method: "personal_sign",
            params: [e, window.wallet],
            from: window.wallet
        }, (function(a, s) {
            if (a || s.error) return $("#settings-err-msg").html('<span>Metamask error.</span><span>Try using <a onclick="openSettingsEthSigWindow();">alternative signing way</a>.</span>'), void modalSettingsDisplayWindow("settings-error-window");
            data = {
                address: window.wallet.toLowerCase(),
                msg: e,
                sig: s.result
            }, t(data)
        }))
    })).catch((function(e) {
        $("#settings-err-msg").html('<span>Authorization was rejected</span><span>Try using <a onclick="changeSettings(true);">alternative signing way</a>.</span>'), modalSettingsDisplayWindow("settings-error-window")
    }))
}

function changePoolDonation() {
    $("#settings-donation").removeClass("invalid-field"), donation = parseFloat($("#settings-donation").val()) / 100, isNaN(donation) || donation > 1 || donation < 0 ? $("#settings-donation").addClass("invalid-field") : "undefined" != typeof ethereum ? modalSettingsDisplayWindow("settings-metamask-sign-window") : openSettingsEthSigWindow()
}

function openMainMenuWindow() {
    modalSettingsDisplayWindow("settings-option-window")
}

function openDefaultSettingsWindow() {
    modalSettingsDisplayWindow("settings-main-window"), $("#settings_min_payout_threshold").select()
}

function attemptESDonationChange() {
    sig = $("#settings-ethereum-signed-challenge").val(), $("#settings-ethereum-signed-challenge").removeClass("invalid-field");
    try {
        sig = JSON.parse(sig)
    } catch {
        $("#settings-ethereum-signed-challenge").addClass("invalid-field")
    }
    applyPoolDonationChange(sig, (function() {
        successDonation()
    }), (function(e) {
        $("#settings-ethereum-signed-challenge").addClass("invalid-field"), alert(e)
    }))
}

function successDonation() {
    parseFloat($("#settings-donation").val()) > 1 && $("#thx-4-contrib").show(), modalSettingsDisplayWindow("settings-success-window")
}

function sortWorkerStats(e) {
    unordered = {}, num = 0, items = [], order = [], sortType = "", $("#rigstats tbody tr").each((function() {
        sortKey = $($(this).children()[e]).attr("sort-key"), sortType = $($(this).children()[e]).attr("sort-type"), "int" == sortType && (sortKey = parseInt(sortKey)), order.push(sortKey), unordered[sortKey] = $(this).html(), items.push(sortKey), num++
    })), window.unordered = unordered, "int" == sortType ? order = order.sort((function(e, t) {
        return e - t
    })) : order = order.sort(), asc = !0, window.prev_sort_key == e ? (window.prev_sort_key = void 0, asc = !1) : window.prev_sort_key = e, asc && order.reverse(), $("#rigstats thead tr th img").each((function() {
        $(this).removeClass("sort-icon-up"), $(this).removeClass("sort-icon-down"), $(this).addClass("sort-icon")
    })), sortIcon = $("#rigstats thead tr th").children()[e], sortIcon = $(sortIcon, "img"), asc ? (sortIcon.removeClass("sort-icon"), sortIcon.removeClass("sort-icon-up"), sortIcon.addClass("sort-icon-down")) : (sortIcon.removeClass("sort-icon"), sortIcon.removeClass("sort-icon-down"), sortIcon.addClass("sort-icon-up")), allEqual(items) || (out_html = "", window.order = order, order.forEach((function(e) {
        out_html = out_html + "<tr>" + unordered[e] + "</tr>"
    })), $("#rigstats-tbody").html(out_html))
}
async function copyAddress() {
    newSVG = '<svg id="Capa_1" enable-background="new 0 0 515.556 515.556" height="512" viewBox="0 0 515.556 515.556" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"/></svg>', elemSVG = $(".account-copy svg"), oldSVG = elemSVG.html(), elemSVG.html(newSVG), elemSVG.html(oldSVG)
}


function reloadData() {
	$('.nanobar').remove();
	$('tr').remove();
	renderStats("");
	render_payments_chart();
	loadData();
}

function loadBalance(e) {
	
    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/balance/`, {}, (function(t) {
		
		$.get(`https://flexpool.io/api/v1/miner/${window.wallet}/totalPaid/`, {}, (function(t2) {
			t2.result > 0 ? balance2 = t2.result / Math.pow(10, 18) : balance2 = 0, 
				$("#totalPaidBalance").html(Math.round(1e6 * balance2) / 1e6), /*balance > 0 && getEthPrice((function(e) {*/
				//$("#totalPaidBalance-usd").html(balance2),
			/*}))*/

        t.result > 0 ? balance = t.result / Math.pow(10, 18) : balance = 0, 
		    $("#totalPaidBalanceUnpaid").html(Math.round(1e6 * (balance+balance2)) / 1e6),
			$("#balance").html(Math.round(1e6 * balance) / 1e6), balance > 0 && getEthPrice((function(e) {
            $("#totalPaidBalanceUnpaid-usd").html(formatMoney((balance+balance2) * e))
            $("#totalPaidBalance-usd").html(formatMoney(balance2 * e))
            $("#balance-usd").html(formatMoney(balance * e))
        })), bar = new Nanobar({
            target: document.getElementById("payout-bar")
        }), payoutPercentage = t.result / e * 100, estimatedDailyProfitTooltipRequired = !0, payoutPercentage >= 100 && ($("#payout-bar").addClass("green"), $("#timeToGetPaid").html(""), $("#tooltip-balance-bar").html(_("100% of payout limit reached.<br>You will be paid in the next payment round.")), payoutPercentage = 99.99999999, estimatedDailyProfitTooltipRequired = !1), $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/estimatedDailyRevenue/`, {}, (function(a) {
            estimatedDailyProfitTooltipRequired && (payoutETA = (e - t.result) / a.result * 86400,
		$("#timeToGetPaid").html(humanizeDuration(1e3 * payoutETA, {
                units: ["d", "h", "m"],
		maxDecimalPoints: 2,
                language: LANGUAGE_CODE
            }) + "."),
		$("#tooltip-balance-bar").html(String(Math.round(payoutPercentage)) + "% " + _("of payout limit reached.<br>Payout limit would be reached in") + " " + humanizeDuration(1e3 * payoutETA, {
                units: ["d", "h", "m"],
		maxDecimalPoints: 2,
                language: LANGUAGE_CODE
            }) + "."))
        })), $(".payout-percentage").html(Math.round(payoutPercentage)),
	     $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/roundShare`, {}, (function(e2) {
                $("#round-share-percent").html(Math.round(100 * e2.result * 1e4) / 1e4 + "%"), 
		$.get("https://flexpool.io/api/v1/pool/averageBlockReward", {}, (function(t) {
                $("#approx-next-block-reward").html("" + /*Math.round*/(e2.result * t.result / Math.pow(10, 18) /* * 1e4*/).toFixed(8-(e2.result * t.result / Math.pow(10, 18)).countDecimals())/* / 1e4*/)
            }))
	    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/estimatedDailyRevenue/`, {}, (function(t) {
                $("#approx-daily-reward").html("" + /*Math.round*/(t.result / Math.pow(10, 18) /* * 1e4*/).toFixed(8-(t.result / Math.pow(10, 18)).countDecimals())/* / 1e4*/),
                $("#approx-weekly-reward").html("" + /*Math.round*/((7*t.result) / Math.pow(10, 18) /* * 1e4*/).toFixed(8-((7*t.result) / Math.pow(10, 18)).countDecimals())/* / 1e4*/),
                $("#approx-monthly-reward").html("" + /*Math.round*/(((new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate())*t.result) / Math.pow(10, 18) /* * 1e4*/).toFixed(8-(((new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate())*t.result) / Math.pow(10, 18)).countDecimals())/* / 1e4*/)
		    
		,getEthPrice((function(e) {
            		$("#approx-next-block-reward-usd").html(formatMoney(parseFloat($("#approx-next-block-reward").html()) * e))
            		$("#approx-daily-reward-usd").html(formatMoney(parseFloat($("#approx-daily-reward").html()) * e))
            		$("#approx-weekly-reward-usd").html(formatMoney(parseFloat($("#approx-weekly-reward").html()) * e))
            		$("#approx-monthly-reward-usd").html(formatMoney(parseFloat($("#approx-monthly-reward").html()) * e))
        	}))
            }))
        })), $(".payout-percentage").html(Math.round(payoutPercentage)), bar.go(payoutPercentage)
		}))
    })).fail((function(e) {
        console.error("Unable to fetch balance", e)
    }))
}

function applyPoolDonation(e) {
    return e *= 100, "0x908b05a2500d55f29737af4081C4AeBb5B78F445" == window.wallet ? ["Dogfucker", "brown"] : "0x3D7193B546A12d287e54c1d6aaC3bf15B82bE59d" == window.wallet || "0x5655cEEc003551c3d9293D6130d5b2b366fe99B4" == window.wallet ? ["Hero", "hero"] : "0x897725d538c796a22C76646FBdB48D9b57CEB2FF" == window.wallet || "0x4368d11f47764B3912127B70e8647Dd031955A7C" == window.wallet ? ["Hero", "hero-rainbow"] : "0x80562C86Bdfc8E201d651a03Fc5D2dE7fa106647" == window.wallet ? ["CHRIS", "vip"] : "0x3B163A8e17cA6FC4522c2dd0a883357106386784" == window.wallet ? ["000-ILLUMINATI", "yellow"] : e < .4 ? ["Freeloader", "freeloader"] : e > 1 && e < 5 ? ["VIP", "vip"] : e > 2 ? ["MVP", "mvp"] : ["Loyal Miner", "loyalminer"]
}

var reloadTimer=0
var startCountdown=0
function loadData() {
    $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/details`, {}, (function(e) {
        loadBalance(e.result.min_payout_threshold);
        e.result.first_joined > 0 ? (rank = applyPoolDonation(e.result.pool_donation), $(".account-rank").html(rank[0]), $(".account-rank").addClass("rank-" + rank[1]), $(".pool-donation").html(`<mark>${Math.round(100*e.result.pool_donation*100)/100}%</mark>`), $("#settings-donation").attr("value", 100 * e.result.pool_donation), $("#settings_min_payout_threshold").attr("value", e.result.min_payout_threshold / 1e18), e.result.max_fee_price > 0 ? $("#settings_gas_price_limit").attr("value", e.result.max_fee_price) : $("#settings_gas_price_limit").attr("placeholder", _("Not set")), $("#settings-email").attr("placeholder", e.result.censored_email), $("#settings-ip").attr("placeholder", e.result.censored_ip), $(".min-payout-threshold").html(`<mark>${Math.round(e.result.min_payout_threshold/1e18*100)/100} ETH</mark>`), $(".first-joined").html(`<mark>${formatAgo(humanizeDuration(Date.now()-1e3*e.result.first_joined,{largest:1,language:LANGUAGE_CODE}))}</mark>`)) : ($(".account-rank").html("N/A"), $(".account-rank").css("color", "#aaa"), $(".pool-donation").html("N/A"), $(".min-payout-threshold").html("N/A"), $(".first-joined").html("N/A"))
    })).fail((function(e) {
        console.error("Unable to load data!", e)
    })), $.get(`https://flexpool.io/api/v1/miner/${window.wallet}/workers`, {}, (function(e) {
        onlineWorkers = 0, offlineWorkers = 0, e.result.forEach((function(e) {
            e.name = encodeHTML(e.name), workerOffline = !e.online, workerOffline ? offlineWorkers++ : onlineWorkers++, classAdditions = "", workerOffline && (classAdditions += "red"), htmldata = `<tr><td id="worker-${e.name}" onclick="renderStats('${e.name}');" sort-key="${e.name}" sort-type="str" class="mono ${classAdditions}"><div class="space-between"><span class="worker-name black-underline ${classAdditions}">${e.name}`, e.same_name_count > 1 && (htmldata += `<span class="bluegray" style="margin-left: 5px;"> (${e.same_name_count})</span>`), htmldata += "</span>", htmldata += '</div></td><td class="mono ', workerOffline && (htmldata += "bluegray"), reportedSi = getSi(e.reported_hashrate), htmldata += `" sort-key="${e.reported_hashrate}" sort-type="int">${Math.round(e.reported_hashrate/reportedSi[0]*10)/10}<span class="bluegray">&nbsp;${reportedSi[1]}H/s</span></td><td class="mono `, effectiveSi = getSi(e.effective_hashrate), lastSeen = Date.now() - 1e3 * e.last_seen, lastSeen < 1e3 ? lastSeenHuman = "now" : lastSeenHuman = formatAgo(humanizeDuration(lastSeen, {
                largest: 1,
                language: LANGUAGE_CODE,
                round: !0
            })), workerOffline && (htmldata += "bluegray"), totalShares = e.valid_shares + e.stale_shares + e.invalid_shares, htmldata += `" sort-key="${e.effective_hashrate}" sort-type="int">${Math.round(e.effective_hashrate/effectiveSi[0]*10)/10}<span class="bluegray">&nbsp;${effectiveSi[1]}H/s</span></td><td sort-key="${e.valid_shares}" sort-type="int" class="mono"><div class="shares-item"><div>${e.valid_shares}</div><span class="bluegray">(${Math.round(e.valid_shares/totalShares*100)}%)</span></div></td><td sort-key="${e.stale_shares}" sort-type="int" class="mono"><div class="shares-item"><div>${e.stale_shares}</div><span class="bluegray">(${Math.round(e.stale_shares/totalShares*100)}%)</span></div></td><td sort-key="${e.invalid_shares}" sort-type="int" class="mono"><div class="shares-item"><div>${e.invalid_shares}</div><span class="bluegray">(${Math.round(e.invalid_shares/totalShares*100)}%)</span></div></td><td id="last-seen-worker-${encodeHTML(e.name)}">${lastSeenHuman}</td></tr>`, $("#rigstats-tbody").append(htmldata)
        })), $(".online-workers").html(onlineWorkers), $(".offline-workers").html(offlineWorkers)
    })).fail((function(e) {
        console.error("Unable to get workers data", e)
    }))
	
	//average luck + average round time
	$.get("https://flexpool.io/api/v1/pool/avgLuckRoundtime", {}, function(l) {
		$("#avgluck").css("display", ""), 
		$("#avgluck").html(`<mark class="luck-value">${formatLuck(l.result.luck,true)}</mark>% <mark class="luck-value" style="color:orange;padding-left: 10px;">${formatLuck(l.result.luck,false)}</mark>%`), 
		$("#avgluck mark").attr("data-luck", l.result.luck), 
		$("#avgroundtime").html(humanizeDuration(1e3 * l.result.round_time, 
		{
			largest: 1,
			language: LANGUAGE_CODE
		}))
		}).fail(function(l) {
			console.error("Unable to get avg luck", l)
		}), $.get("https://flexpool.io/api/v1/pool/blockCount", {}, function(l) {
			$("#block-count").html(l.result.confirmed + l.result.unconfirmed)
		}).fail(function(l) {
			console.error("Unable to get block count", l)
		}), $.get("https://flexpool.io/api/v1/pool/currentLuck", {}, function(l) {
			$("#current-luck").html(`<span class="luck-value" data-luck="${l.result}">${formatLuck(l.result,isPro)}</span>%`)
		}).fail(function(l) {
			console.error("Unable to get current luck", l)
	})
	//
	
	//average blocks based on pool hashrate and blocks per day
	$.get(`https://flexpool.io/api/v1/pool/blocks?page=0`, {}, (function(t1) {	
		$.get(`https://flexpool.io/api/v1/pool/hashrate`, {}, (function(t2) {
			//console.log(t1.result.data[0].difficulty);
			//console.log(parseInt(t1.result.data[0].difficulty, 16));
			//console.log(t2.result.total);
			var blockPerMinute=((t1.result.data[0].difficulty/t2.result.total)/60).toFixed(1);
			var blockPerDay=((60/blockPerMinute)*24).toFixed(1);
			//console.log(blockPerMinute,blockPerDay);
			$("#blocksPerMinute").html(blockPerMinute+" mins");
			$("#blocksPerDay").html(blockPerDay);
			$("#poolHashrate").html((t2.result.total/1000000000000).toFixed(3)+" TH/s");
			
		}));
	}));
    //
	$.get(`https://flexpool.io/api/v1/pool/currentLuck`, {}, (function(t) {
		$("#currentluck").css("display", ""), 
		$("#currentluck").html(`<mark class="luck-value">${formatLuck(t.result,true)}</mark>% <mark class="luck-value" style="color:orange;padding-left: 10px;">${formatLuck(t.result,false)}</mark>%`), 
		$("#currentluck mark").attr("data-luck", t.result)
	}));
	
	$.get(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=97P7K57FXX34M489NFZWWKKX4V8EF27RHW`, {}, (function(t) {
		$("#gasPrices").html(t.result.SafeGasPrice+" / "+t.result.ProposeGasPrice+" / "+t.result.FastGasPrice)
	}));
	
	$.get(`https://flexpool.io/api/v1/miner/${window.wallet}/details`, {}, (function(e) {
	    $("#currentGasSettings").html(e.result.max_fee_price)
	}));

	
	$.get(`https://flexpool.io/api/v1/pool/hashrate`, {}, (function(t) {	
		var currentTime = new Date();
		var currentDay=String(currentTime.getDate()).padStart(2, '0'),
			day=String(currentTime.getDate()).padStart(2, '0'),
			currentHour=currentTime.getHours(), count=0, countToday=0, countTodayUncle=0, count24=0, count24Uncle=0, 
		    	luck=0, hours=0, lastBlockTime=new Date(), gotLastBlockTime=false, reward24=0, rewardToday=0;
		do {
		$.ajax({
		async: false,
		type: 'GET',
		url: 'https://flexpool.io/api/v1/pool/blocks?page='+count,
		success: function(t1) {
		//$.get(, {}, (function() {
			count=count+1;
			var l=t1.result.data.length, i=0;
			for (i=0;i<l;i++) {
				var date = new Date(t1.result.data[i].timestamp * 1000);
				if (gotLastBlockTime==false)
				{
					gotLastBlockTime=true;
					lastBlockTime=lastBlockTime.getTime()-date.getTime();
				}
				day = String(date.getDate()).padStart(2, '0');
				hours = Math.abs(currentTime - date) / 36e5;
				//console.log(currentHour,date.getHours(),hours);
				if (currentDay==day) { countToday=countToday+1; rewardToday=rewardToday+(Math.round(t1.result.data[i].total_rewards / Math.pow(10, 18) * 100) / 100); }
				if (currentDay==day && t1.result.data[i].type=="uncle") countTodayUncle=countTodayUncle+1;
				if (hours<24) { count24=count24+1; luck=luck+t1.result.data[i].luck; reward24=reward24+(Math.round(t1.result.data[i].total_rewards / Math.pow(10, 18) * 100) / 100); }
				if (hours<24 && t1.result.data[i].type=="uncle") { count24Uncle=count24Uncle+1; }
			}
		}});
		} while (hours<24)
		//console.log(currentDay,day,hours,countToday,count24,formatLuck(luck/count24,true),formatLuck(luck/count24,false));
        	luck=luck/count24;
        	$("#avgluck24").css("display", ""), 
		$("#avgluck24").html(`<mark class="luck-value">${formatLuck(luck,true)}</mark>% <mark class="luck-value" style="color:orange;padding-left: 10px;">${formatLuck(luck,false)}</mark>%`), 
		$("#avgluck24 mark").attr("data-luck", luck)
		$("#blocksLast24").html(count24+"<mark style='color:#752c2c;font-size: 24px;padding-left: 4px;'>"+count24Uncle+"</mark> / "+countToday+"<mark style='color:#752c2c;font-size: 24px;padding-left: 4px;'>"+countTodayUncle+"</mark>");
		$("#minedETH").html(reward24.toFixed(1)+" / "+rewardToday.toFixed(1));
		
		if (lastBlockTime<3600000)
		$("#timeSinceLastBlock").html(humanizeDuration(lastBlockTime, 
		{
			units: ["m"],
			maxDecimalPoints: 1,
			language: LANGUAGE_CODE
		}));
		else		
		$("#timeSinceLastBlock").html(humanizeDuration(lastBlockTime, 
		{
			units: ["h"],
			maxDecimalPoints: 2,
			language: LANGUAGE_CODE
		}));
		
	}));

	
}
$(".settings-modal-bg").click((function() {
    $(".settings-modal").data("hover") || closeSettings()
})), $(document).keyup((function(e) {
    window.settingsOpened && "input" != document.activeElement.tagName.toLowerCase() && 27 == e.which && closeSettings()
})), $(document).ready((function() {
    Highcharts.setOptions({
        colors: ["#0069ff", "#2c3e50", "#3498db"]
    }), window.settingsOpened = !1, window.settingsWindows = ["settings-main-window", "next-step-window", "settings-loading-window", "settings-success-window", "settings-error-window", "settings-option-window", "settings-metamask-sign-window", "settings-sign-window", "settings-pool-donation-window", "settings-es-notice-window", "settings-freeloader-notice-window"], $("#stats").css({
        visibility: "visible",
        display: "none"
    }), fragmentChanged(), $("#worker-search").trigger("input"), renderHeader(""), window.changeAddressWidthPrevMobile = !1, window.hasEmailUpdated = !1
})), $(window).on("hashchange", (function() {
    window.ignoreHashChange ? window.ignoreHashChange = !1 : fragmentChanged()
})), $("#rigstats thead th.sorted").click((function() {
    sortWorkerStats($(this).index()), $("#worker-search").trigger("input")
})), $("#worker-search").on("input", (function() {
    input = $("#worker-search").val(), trs = $("#rigstats tbody tr"), trs_displayed = [], trs.each((function(e) {
        $(this).removeClass("noborderbottom"), child = $($(this).children()[0]), val = child.attr("sort-key"), val.toLowerCase().includes(input.toLowerCase()) ? ($(this).show(), trs_displayed.push($(this))) : $(this).hide()
    })), last_tr_displayed = trs_displayed[trs_displayed.length - 1], "undefined" != typeof last_tr_displayed && last_tr_displayed.addClass("noborderbottom")
})), $(".hover-tooltip").on({
    mouseenter: function() {
        tooltip = $(this).parent().find(".tooltip"), tooltip.css("visibility", "visible"), tooltip.css({
            opacity: 1
        })
    },
    mouseleave: async function() {
        tooltip = $(this).parent().find(".tooltip"), tooltip.parent().find(".tooltip").css({
            opacity: 0
        }), await sleep(200), tooltip.css("visibility", "hidden")
    }
}), $(".account-copy").click((async function() {
    for (newSVG = '<svg id="Capa_1" enable-background="new 0 0 515.556 515.556" height="512" viewBox="0 0 515.556 515.556" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"/></svg>', elemSVG = $(".account-copy svg"), tooltip = $(".copy-tooltip"), oldSVG = elemSVG.html(), elemSVG.html(newSVG), tooltipOldText = tooltip.html(), addressTextArea = document.getElementById("wallet-textarea-for-copy"), addressTextArea.select(), addressTextArea.setSelectionRange(0, 999999), document.execCommand("copy"), copyToClipboard(window.wallet), tooltip.html("Copied!"); $(".account-copy").is(":hover");) await sleep(100);
    await sleep(300), elemSVG.html(oldSVG), await sleep(200), tooltip.html(tooltipOldText)
})), Array.prototype.remove = function() {
    for (var e, t, a = arguments, s = a.length; s && this.length;)
        for (e = a[--s]; - 1 !== (t = this.indexOf(e));) this.splice(t, 1);
    return this
}, search_history = localStorage.getItem("autocompleteSearchHistory"), null != search_history ? (search_history = JSON.parse(search_history), search_history.remove(window.wallet), search_history = [window.wallet].concat(search_history), search_history.length > 3 && search_history.pop()) : search_history = [window.wallet], localStorage.setItem("autocompleteSearchHistory", JSON.stringify(search_history)), $("body").on("keydown", (function(e) {
    if (!window.settingsOpened && !$("input#worker-search").is(":focus")) switch (e.keyCode) {
        case 83:
            switchView("stats");
            break;
        case 80:
            switchView("payouts");
            break;
        case 66:
            window.isPro && switchView("blocks")
    }
})), $(".settings-modal-bg").click((async function() {
    window.settingsOpened && (window.settingsModalClicked ? window.settingsModalClicked = !1 : closeSettings())
})), $(".settings-modal").click((function() {
    window.settingsModalClicked = !0
})), tenMidModInit = Date.now() / 1e3 % 600, loadData(), $("#settings-ip").on("keydown", (function(e) {
    13 == e.which && applySettings()
})), $("#settings_min_payout_threshold").on("keydown", (function(e) {
    13 == e.which && $("#settings_gas_price_limit").select()
})), $("#settings_gas_price_limit").on("keydown", (function(e) {
    13 == e.which && $("#settings-email").select()
})), $("#settings-email").on("keydown", (function(e) {
    13 == e.which && nextStepSettings()
})), $("#settings-donation").on("keydown", (function(e) {
    13 == e.which && openESNotice()
})), window.workerUpdates = {};
//let workerUpdateWebsocket = new WebSocket(window.location.protocol.replace("http", "ws") + "//" + window.location.host + "/api/v1/ws/worker-ws/" + window.wallet + "/");
//let workerUpdateWebsocket = new WebSocket("ws://flexpool.io/api/v1/ws/worker-ws/" + window.wallet + "/");
async function workerUpdater() {
    for (;;) {
        for (worker in window.workerUpdates) lastSeen = Date.now() - window.workerUpdates[worker], lastSeen < 1e3 ? lastSeenHuman = _("now") : lastSeenHuman = formatAgo(humanizeDuration(lastSeen, {
            largest: 1,
            language: LANGUAGE_CODE,
            round: !0
        })), $(`#last-seen-worker-${worker}`).html(lastSeenHuman);
        await sleep(100)
    }
}
//workerUpdateWebsocket.onmessage = function(e) {
//    for (key in msgJSON = JSON.parse(e.data), msgJSON) window.workerUpdates[key] = msgJSON[key]
//}, workerUpdater();
