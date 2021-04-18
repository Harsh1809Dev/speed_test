#!/usr/bin/env node

require("chromedriver");
const { ServiceBuilder, Options: ChromeOptions } = require('selenium-webdriver/chrome');
const cli_progress = require("cli-progress");

async function open_web_driver(){
    let wd = require("selenium-webdriver");
    return wd;
}

async function open_browser(wd,is_true){
    if(!is_true){
        const chromeOptions = new ChromeOptions();
        chromeOptions.excludeSwitches('enable-logging');
        chromeOptions.headless();
        let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return browser;
    }
    else{
        const chromeOptions = new ChromeOptions();
        chromeOptions.excludeSwitches('enable-logging');
        let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        return browser;
    }

}

async function open_url(browser, url){
    await browser.get(url);
}

async function start(browser,wd){
    await browser.wait(wd.until.elementLocated(wd.By.css(".start-text")));
    let start_button = await browser.findElement(wd.By.css(".start-text"));
    await start_button.click();
}

async function get_ping(browser,wd){
    await browser.wait(wd.until.elementLocated(wd.By.css(".result-data-large.number.result-data-value.ping-speed")));
    let table = await browser.findElement(wd.By.css(".result-data-large.number.result-data-value.ping-speed"));
    let ping = table.getAttribute("innerText");
    return ping;
}    

async function get_download_speed(browser,wd){
    await browser.wait(wd.until.elementLocated(wd.By.css(".result-data-large.number.result-data-value.download-speed")));
    let element = await browser.findElement(wd.By.css(".result-data-large.number.result-data-value.download-speed"));
    let download_speed = await element.getAttribute("innerText");
    return download_speed;
}    

async function get_upload_speed(browser,wd){
    await browser.wait(wd.until.elementLocated(wd.By.css(".result-data-large.number.result-data-value.upload-speed")));
    let element = await browser.findElement(wd.By.css(".result-data-large.number.result-data-value.upload-speed"));
    let upload_speed = await element.getAttribute("innerText");
    return upload_speed;
} 

function print_result(ping,download_speed,upload_speed){
    console.log("\n");
    console.log("PING: " + ping + " ms");
    console.log("DOWNLOAD SPEED: " + download_speed + " mbps");
    console.log("UPLOAD SPEED: " + upload_speed + " mbps");
}
async function main(){
    let args = process.argv.slice(2);
    let wd = await open_web_driver()
    let bar1 = new cli_progress.SingleBar({
        stopOnComplete: true
    }, cli_progress.Presets.legacy);
    bar1.start(7,0);
    let browser;
    if(args.includes("-t")){
        browser = await open_browser(wd,true);
    }
    else{
        browser = await open_browser(wd,false);
    }
    bar1.increment(1);
    bar1.update(1);
    await open_url(browser,"https://www.speedtest.net");
    bar1.increment(2);
    bar1.update(2);
    await start(browser,wd);
    bar1.increment(3);
    bar1.update(3);
    await browser.wait(wd.until.elementLocated(wd.By.css(".result-container-speed.result-container-speed-active")));
    let ping = await get_ping(browser,wd);
    bar1.increment(4);
    bar1.update(4);
    let download_speed = await get_download_speed(browser,wd);
    bar1.increment(5);
    bar1.update(5);
    let upload_speed = await get_upload_speed(browser,wd);
    bar1.increment(6);
    bar1.update(6);
    bar1.stop();
    print_result(ping,download_speed,upload_speed);
    browser.quit();
}

main()