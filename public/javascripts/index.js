
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    try {
        let response = await fetch("api/v1/urls/preview?url=" + url)
        let preview = await response.text()
        displayPreviews(preview)
    } catch (error) {
        console.error('Fetch error:', error);
        displayPreviews(`Error occurred: could't load website :(`);
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
