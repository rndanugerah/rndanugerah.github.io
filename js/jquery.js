// typing animation
var typed = new Typed ('#text-animate', {
    strings: ['Software Developer/Engineer', 'Web Programmer', 'Backend Programmer', 'Machine Learning Enthusiast'],
    backSpeed: 100,
    typeSpeed: 100,
    backDelay: 600,
    loop: true
});

// Get the modal
var modal = document.getElementById("modalContact");

// Get the link that opens the modal
var link = document.getElementById("modalContact");

// Get the <span> element that closes the modal
var close = document.getElementsByClassName("close")[0];

// When the user clicks the link, open the modal
link.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//about section
$(function() {
  $("#aboutSection").load("sections/about.html");
});

//skills section
$(function() {
  $("#skillsSection").load("sections/skills.html");
});


//portfolio section
$(function() {
  $("#portfolioSection").load("sections/portfolio.html");
});


