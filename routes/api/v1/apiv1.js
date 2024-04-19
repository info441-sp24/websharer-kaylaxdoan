import express from 'express';
var router = express.Router();
import fetch from 'node-fetch'  
import parser from 'node-html-parser'

router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.get('/urls/preview', async (req, res, next) => {
    try {
        let url = req.query.url
        let response = await fetch(url)
        let pageText = await response.text()
        
        let html = parser.parse(pageText)

        let htmlReturn = ""

        let ogUrl = html.querySelector("meta[property='og:url']") ? html.querySelector("meta[property='og:url']").attributes.content : url;

        let ogTitle = html.querySelector("meta[property='og:title']") ? html.querySelector("meta[property='og:title']").attributes.content : (html.querySelector("title") ? html.querySelector("title").textContent : url);

        let ogImage = html.querySelector("meta[property='og:image']") ? html.querySelector("meta[property='og:image']").attributes.content : null;

        let ogDescription = html.querySelector("meta[property='og:description']") ? html.querySelector("meta[property='og:description']").attributes.content : "";

        let ogSiteName = html.querySelector("meta[property='og:site_name']") ? html.querySelector("meta[property='og:site_name']").attributes.content : "";
       
        htmlReturn += "<div style='max-width: 300px; border: solid 1px #ddd; padding: 3px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border-radius: 10px;'>";
        htmlReturn += "<a href='" + ogUrl + "'>";
        htmlReturn += "<p style='margin-bottom: 10px;'><strong> " + ogTitle + "</strong></p>";
        if (ogImage) {
            htmlReturn += "<img src='" + ogImage + "' style='max-height: 200px; max-width: 270px; margin-bottom: 10px;'>";
        }
        htmlReturn += "</a>";

        if (ogDescription) {
            htmlReturn += "<p style='margin-bottom: 10px;'>" + ogDescription + "</p>";
        }

        if (ogSiteName) {
            htmlReturn += "<p style='margin-bottom: 10px;'>Site Name: " + ogSiteName + "</p>";
        }

        htmlReturn += "</div>";

        console.log(htmlReturn);
        res.type("html");
        res.send(htmlReturn);

    } catch (error) {
        console.log(error)
        res.status(500).send("Error loading website information")
    }
});

export default router;
