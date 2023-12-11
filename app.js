const menuData = [
  { url: 'https://sites.libsyn.com/483279', title: 'The Yacht Or Nyacht Podcast' },
  { url: 'https://sites.libsyn.com/483282', title: 'Billion Dollar Record Club' },
  { url: 'https://open.spotify.com/playlist/6kVRZHsbV6LZEBiqzSzFvq', title: 'Certified Yacht Rock Playlist' },
  { url: 'https://docs.google.com/spreadsheets/d/1IZWQGzd3jQYOONuIi8eKBonA4lZ0xG1J4azf3dn81zk/edit', title: 'The Yachtski Scale' },
];

document.addEventListener('DOMContentLoaded', function () {
  populateMenu();

  const menuBtn = document.getElementById('menuBtn');

  menuBtn.addEventListener('click', (e) => {
    const menuList = document.getElementById('menuList');

    if (menuList.style.display === "none") {
      menuList.style.display = "block";
    } else {
      menuList.style.display = "none";
    }
  });
}, false);

function populateMenu() {
  // Generate menu list items
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';

  menuData.forEach((item) => {
    const listItem = document.createElement('div');
    listItem.className = 'menu-list-item';
    listItem.innerHTML = item.title;

    listItem.addEventListener('click', (e) => {
      menuList.style.display = 'none';
      window.open(item.url, '_blank');
    });

    menuList.appendChild(listItem);
  });
}
