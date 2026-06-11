let allChannels=[];

fetch("channels.json")
.then(res=>res.json())
.then(data=>{
allChannels=data;
showChannels(data);
});

function showChannels(channels){

const box=document.getElementById("channels");
box.innerHTML="";

channels.forEach(ch=>{

box.innerHTML += `
<div class="channel"
onclick="playChannel('${ch.url}')">

<img src="${ch.logo}">

<div>
<h3>${ch.name}</h3>
<p>${ch.category}</p>
</div>

</div>
`;

});

}

function playChannel(url){

const player=document.getElementById("player");

player.src=url;

player.play();

}

function filterChannel(category){

if(category==="All"){
showChannels(allChannels);
return;
}

const filtered=
allChannels.filter(
x=>x.category===category
);

showChannels(filtered);

}