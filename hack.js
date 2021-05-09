const puppeteer = require("puppeteer");
const fs = require('fs');
const { Name } = require("selenium-webdriver/lib/command");
//const nodemailer=require("nodemailer");
const pos = "Software developer";
const place = "India";
async function jobFunc() {
    let browser = await puppeteer.launch
        ({
            headless: false,
            defaultViewport: false,
        });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://in.indeed.com/");
    await tab.waitForSelector(".icl-TextInput-control.icl-TextInput-control--whatWhere", { visible: true });
    console.log("Fetching jobs");
    await tab.click('input[name="q"]');
    await tab.type("#text-input-what", pos);
    await tab.click('input[name="l"]');
    await tab.type("#text-input-where", place);
    await tab.click(".icl-Button.icl-Button--primary.icl-Button--md.icl-WhatWhere-button");
    await tab.waitForSelector(".jobsearch-SerpJobCard.unifiedRow.row.result.clickcard", { visible: true }); //networkidle lgade

    const jobselector = '.jobsearch-SerpJobCard.unifiedRow.row.result.clickcard';
    const job = await tab.$$eval(jobselector, nodes => {
        return nodes.map(node => {
            let role = node.querySelector('a.jobtitle.turnstileLink').textContent;
            const Role = role.replace("\n", "")
            let organization = node.querySelector('span[class="company"]').textContent;
            const Organization = organization.replace("\n", "");
            let url = node.querySelector('a').getAttribute('href');
            const Url = url.replace("/", "https://in.indeed.com/");

            return {
                Role,
                Organization,
                Url,
            }
        })
    });
    // let arr=[];
    // for(let i=1;i<job.length;i++)
    // {
    //     let role=job[i].role;
    //     let organization=job[i].organization;
    //     let url=job[i].url;
    //     let obj = 
    //     {
    //         Role:role,
    //         Organization:organization,
    //         Url:url
    //     }
    //     arr.push(obj);
    //console.table(arr);

    fs.writeFile('./Job_Openings.json', JSON.stringify(job), err => err ? console.log(err) : null);
    console.log("Completed and Printed in JSON file");
    const gfgUrl = "https://practice.geeksforgeeks.org/explore/?problemType=full&difficulty%5B%5D=1&page=1";
    await gfgTopic(gfgUrl, tab, tabs, browser);
}
async function gfgTopic(gfgUrl, tab, tabs, browser) {

    tab = await browser.newPage();
    //tab=tabs[0];
    await tab.goto(gfgUrl);
    console.log("Fetching Questions");
    await tab.waitForSelector(".col-sm-6.col-md-6.col-lg-6.col-xs-12.item", { visible: true });
    const link = ".col-sm-6.col-md-6.col-lg-6.col-xs-12.item";
    //let arr=[];
    const links = await tab.$$eval(link, nodes => {
        return nodes.map(node => {
            let Name = node.querySelector('span[style="display:block;font-size: 20px !important"]').textContent;
            let Link = node.querySelector('a').getAttribute('href');
            // let obj={
            //    Name:name,
            //    Link:link
            // }
            //arr.push(obj);
            return {
                Name,
                Link,
            }

        })

    });
    // let arr=[];
    // let op=Math.floor(Math.random()*5); 
    // let pp=links[op];
    // arr.push(pp);
    // console.log(arr);

    fs.writeFileSync('./Questions.json', JSON.stringify(links), err => err ? console.log(err) : null);
    console.log("Completed and printed in JSON file");
    const motUrl = "https://theultralinx.com/2016/01/awesome-quotes-posters-pictures/";
    await motivation(motUrl);
}

async function motivation(motUrl) {
    console.log("Still working dont quit");
    let browser = await puppeteer.launch
        ({
            headless: true,
            defaultViewport: false,
        });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto(motUrl);
    await tab.waitForSelector(".entry-header-inner", { visible: true });
    let place = ".pk-pin-it-container";
    console.log("Your daily dose of Motivation");
    const imgUrl = await tab.$$eval(place, nodes => {
        return nodes.map(node => {
            let murl = node.querySelector('img').src;
            return {
                murl,
            }
        })
    });
    let final = [];
    let possible = Math.floor(Math.random() * 40);
    let randomUrl = imgUrl[possible];
    //const lUrl=randomUrl.replace("murl","");

    final.push(randomUrl);
    console.log(final);
    browser.close();
}

jobFunc();

