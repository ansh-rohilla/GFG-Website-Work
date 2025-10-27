console.log("Problem page initialized successfully!");

// Tag filter interaction
const tags = document.querySelectorAll(".tag");

tags.forEach(tag => {
  tag.addEventListener("click", () => {
    tags.forEach(t => t.classList.remove("active"));
    tag.classList.add("active");

    console.log(`Selected Topic: ${tag.textContent}`);
  });
});
