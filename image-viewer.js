const imageTrigger = document.querySelector('.image-open');
const imageDialog = document.querySelector('#image-viewer');
const fullImage = document.querySelector('.image-full');
const closeButton = document.querySelector('.image-close');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let closing = false;
let previousBodyOverflow;
let previousRootOverflow;

// Animate from the thumbnail's position; the enlarged image always keeps its ratio.
function thumbnailFrame() {
  const thumbnail = imageTrigger.getBoundingClientRect();
  const full = fullImage.getBoundingClientRect();
  const scale = full.width && full.height
    ? Math.min(thumbnail.width / full.width, thumbnail.height / full.height)
    : .94;
  const x = thumbnail.left + thumbnail.width / 2 - full.left - full.width / 2;
  const y = thumbnail.top + thumbnail.height / 2 - full.top - full.height / 2;
  return { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: 0 };
}

imageTrigger.addEventListener('click', (event) => {
  if (typeof imageDialog.showModal !== 'function') return;
  event.preventDefault();
  if (imageDialog.open) return;
  previousBodyOverflow = document.body.style.overflow;
  previousRootOverflow = document.documentElement.style.overflow;
  imageDialog.showModal();
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  if (!reducedMotion.matches && typeof fullImage.animate === 'function') {
    fullImage.animate([thumbnailFrame(), { transform: 'none', opacity: 1 }], {
      duration: 340, easing: 'cubic-bezier(.2,.7,.2,1)'
    });
  }
});

async function closeImage() {
  if (!imageDialog.open || closing) return;
  closing = true;
  fullImage.getAnimations().forEach((animation) => animation.cancel());
  const targetFrame = thumbnailFrame();
  if (!reducedMotion.matches && typeof fullImage.animate === 'function') {
    imageDialog.classList.add('is-closing');
    await fullImage.animate([{ transform: 'none', opacity: 1 }, targetFrame], {
      duration: 220, easing: 'cubic-bezier(.4,0,.8,.3)', fill: 'forwards'
    }).finished.catch(() => {});
  }
  imageDialog.close();
}

closeButton.addEventListener('click', closeImage);
imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog || event.target.classList.contains('image-stage')) closeImage();
});
imageDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeImage();
});
imageDialog.addEventListener('keydown', (event) => {
  // The close control is the viewer's only interactive element.
  if (event.key === 'Tab') {
    event.preventDefault();
    closeButton.focus();
  }
});
imageDialog.addEventListener('close', () => {
  fullImage.getAnimations().forEach((animation) => animation.cancel());
  imageDialog.classList.remove('is-closing');
  document.body.style.overflow = previousBodyOverflow;
  document.documentElement.style.overflow = previousRootOverflow;
  closing = false;
  imageTrigger.focus({ preventScroll: true });
});
