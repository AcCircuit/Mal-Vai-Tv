document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const channelsContainer = document.getElementById("channels");
    const channelTitle = document.getElementById("channel-title");
    let hlsPlayer = null;

    // Stream loader function with HLS fallback
    function loadStream(url, title) {
        channelTitle.textContent = "Now Playing: " + title;

        if (hlsPlayer) {
            hlsPlayer.destroy();
        }

        if (Hls.isSupported()) {
            hlsPlayer = new Hls({
                maxMaxBufferLength: 10 // Prevent infinite buffering on laggy live streams
            });
            hlsPlayer.loadSource(url);
            hlsPlayer.attachMedia(video);
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => console.log("Autoplay paused. Click play to watch."));
            });
        } 
        // Direct support for iOS Safari
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        } else {
            alert("Your browser does not support live HLS streaming.");
        }
    }

    // Fetch dynamic JSON channel data
    fetch('channels.json?v=' + Date.now()) // Avoid browser cache issues
        .then(res => res.json())
        .then(data => {
            data.forEach((channel, index) => {
                const card = document.createElement("div");
                card.className = "channel-item";
                
                const logo = channel.logo ? channel.logo : "https://via.placeholder.com/100x55?text=LIVE";

                card.innerHTML = `
                    <img src="${logo}" alt="${channel.name}">
                    <p>${channel.name}</p>
                `;

                card.addEventListener("click", () => {
                    loadStream(channel.url, channel.name);
                });

                channelsContainer.appendChild(card);

                // Auto-load the very first channel on startup
                if (index === 0) {
                    loadStream(channel.url, channel.name);
                }
            });
        })
        .catch(err => {
            console.error("Error loading JSON data:", err);
            channelsContainer.innerHTML = "<p style='color:red; padding:10px;'>Error loading channel list.</p>";
        });
});
