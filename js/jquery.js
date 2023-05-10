// home section

// scroll section
function setActiveLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.onscroll = () => {

  window.addEventListener('scroll', setActiveLink);
  // sticky header
  let header = document.querySelector('header')

  header.classList.toggle('sticky', window.scrollY > 100);
};

// typing animation
var typed = new Typed ('#text-animate', {
    strings: ['Software Developer/Engineer', 'Web Programmer', 'Backend Programmer', 'Machine Learning Enthusiast'],
    backSpeed: 100,
    typeSpeed: 100,
    backDelay: 600,
    loop: true
});

// modal section
var modal = document.getElementById('modalContact');

// Get the link that opens the modal
var link = document.getElementById('modalContact');

// Get the <span> element that closes the modal
var close = document.getElementsByClassName('close')[0];

// When the user clicks the link, open the modal
link.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

//about section
$(function() {
  $('#aboutSection').load('sections/about.html');
});

//skills section
$(function() {
  $('#skillsSection').load('sections/skills.html');
});

//portfolio section
$(function() {
  $('#portfolioSection').load('sections/portfolio.html');
});

//contact section
$(function() {
  $('#contactSection').load('sections/contact.html');
});




