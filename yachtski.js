document.addEventListener('DOMContentLoaded', function () {
  const fetchButton = document.getElementById('fetch-songs-button');

  fetchButton.addEventListener('click', (e) => {
    console.log("clicks!")
    fetchsongs();
  });
}, false);

async function fetchsongs() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
};