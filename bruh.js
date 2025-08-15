function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function preloadImages(urls) {
  return Promise.all(urls.map(url => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = url;
    });
  }));
}


async function populateListings(containerId, count = 5, imageOffset = 0) {
  const parentElement = document.getElementById(containerId);
  if (!parentElement) return;
  // Remove any existing show-more button
  const oldShowMore = parentElement.querySelector('.show-more');
  if (oldShowMore) oldShowMore.remove();
  for (let i = 0; i < count; i++) {
    const newElement = document.createElement('div');
    const price = Math.floor(Math.random() * 1000000) + 1000000;
    const localizedPrice = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price);
    newElement.classList.add('listing');
    setTimeout(() => {
      newElement.style.opacity = '1';
    }, 10);
    newElement.innerHTML = `
      <img src="https://picsum.photos/300/300/?random=${imageOffset + i}" alt="Land ${i + 1}">
      <h2>ที่ดินแปลงสวย ${i + 1}</h2>
      <p>ราคา: ${localizedPrice} บาท</p>
    `;
    parentElement.appendChild(newElement);
    await delay(150);
  }
  // Add show more button after the fifth listing
  const showMore = document.createElement('div');
  showMore.className = 'show-more';
  showMore.innerHTML = '<i class="fa-solid fa-arrow-right"></i> Show More';
  parentElement.appendChild(showMore);
}

document.addEventListener('DOMContentLoaded', async function() {
  document.body.classList.add('splashing');
  const splashOverlay = document.getElementById('splash-overlay');
  const splashLogo = document.getElementById('splash-logo');
  const splashVersion = document.getElementById('splash-version');
  // Prepare image URLs for all sections
  const containers = document.querySelectorAll('.listing-container');
  let globalImageOffset = 0;
  let allImageUrls = [];
  for (let container of containers) {
    for (let i = 0; i < 5; i++) {
      allImageUrls.push(`https://picsum.photos/300/300/?random=${globalImageOffset + i}`);
    }
    globalImageOffset += 10;
  }
  // Fade in logo and version
  setTimeout(() => {
    splashLogo.style.opacity = '1';
    splashVersion.style.opacity = '1';
  }, 300);
  // Preload images while splash is showing
  await Promise.all([
    delay(1300),
    preloadImages(allImageUrls)
  ]);
  // Fade out logo and version
  splashLogo.style.opacity = '0';
  splashVersion.style.opacity = '0';
  // Fade out overlay
  splashOverlay.style.opacity = '0';
  setTimeout(() => {
    splashOverlay.style.display = 'none';
    document.body.classList.remove('splashing');
  }, 700);
  // Render listings after splash and images are loaded
  globalImageOffset = 0;
  for (let container of containers) {
    await populateListings(container.id, 5, globalImageOffset);
    globalImageOffset += 10;
    container.addEventListener('wheel', function(e) {
      if (e.target.closest('.listing')) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
});