function $(param) {
  if (typeof param === "string" && param.includes("#", 0)) {
    return document.getElementById(param.slice(1));
  }
}

//To mimic the hide functionality
function hide(element) {
  element.style.display = "none";
}

//to mimic the "show" funcitonality
function show(element) {
  element.style.display = "block";
}
