// I know you hate the "trash comments." I left in the // Console.logs because I can just do a find+replace for "// Cons" to start debugging immediately

var courseSel = "";
var courses = {};
var stat;
var stdID = null;
var logIDList = [];
var currTheme = "bg-PriSilver"
var PriColorNodes
var SecColorNodes
var MainPage

function createUUID() {
  return "xxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getCourses() {
  // console.log("get Courses triggered");
  if(courseSel==""){
    response = await axios("/api/v1/courses");
    for (datum in response.data) {
      $(
        "#course"
      ).innerHTML += `<option value=${response.data[datum].id}>${response.data[datum].display}</option>`;
    }
    courses = response.data;
  }
}

function checkTheme(){
  // console.log ("theme checked")
  PriColorNodes=document.querySelectorAll("div.bg-PriGreen")
  SecColorNodes=document.querySelectorAll(".bg-PriSilver")
  MainPage = document.querySelectorAll(".bg-PriWhite")  
  console.log(`user pref: ${localStorage.theme} `)
  console.log(`OS pref: Dark:${window.matchMedia('(prefers-color-scheme: dark)').matches} Light:${window.matchMedia('(prefers-color-scheme: light)').matches}`)
  
  if(localStorage.theme ){
    setTheme(localStorage.theme)
  }
 
  //Branch here to check call of theme
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme("dark")
    console.log("OS Pref: Dark")  
  }

  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme("light")
    localStorage.setItem("theme", "light")
    console.log("OS Pref: Light") 
  }
  else{
    console.log("no OS Pref, Setting to Light theme")
  }
}

function setTheme(data){
  if (data == "dark"){
    localStorage.setItem("theme", "dark")
    currTheme = "bg-PriGreen"
    modifyColors(PriColorNodes,"bg-PriGreen","bg-SecMedGrn")
    modifyColors(SecColorNodes,"bg-PriSilver","bg-PriGreen")
    modifyColors(MainPage,"bg-PriWhite","bg-PriBlack")
    document.getElementById("themeToggle").setAttribute("onclick","setTheme('light')")    

  }
  else{
    localStorage.setItem("theme", "light")
    modifyColors(PriColorNodes,"bg-SecMedGrn","bg-PriGreen")
    modifyColors(SecColorNodes,"bg-PriGreen","bg-PriSilver")
    modifyColors(MainPage, "bg-PriBlack", "bg-PriWhite")
    document.getElementById("themeToggle").setAttribute("onclick","setTheme('dark')")      
  }
}

function modifyColors(obj, target, replacement ){
    obj.forEach(node => {
    node.classList.remove(target)
    node.classList.add(replacement)
  })
}; 

function toggleFormBody(data) {
  let form = $("#restOfBody");
  if (data != 0) {
    show(form);
    courseSel = courses[data - 1].id;
    if (stdID != null) {
      removeList();
      getNotes(stdID);
    }
  } else {
    hide(form);
    courseSel = "";
  }
}

function removeList() {
  $("#logsList").innerHTML = "";
  logIDList = [];
}

async function checkID(data) {
  if (!isNaN(data)) {
    if (100000000 > data && data > 9999999) {
      $("#uvuIdDisplay").innerText = `Student Logs for ${data}`;
      stdID = data;
      getNotes(data);
    }
  }
}
async function getNotes(id) {
  // console.log("get notes triggered");
  let response = await axios({
    method: "get",
    url: `/api/v1/logs?courseId=${courseSel}&uvuId=${id}`,
  });
  let data = response.data;
  for (datum in data) {
    let skip = false;
    for (ids in logIDList) {
      if (logIDList[ids] === data[datum].id) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      $(
        "#logsList"
      ).innerHTML += `<li onclick="toggleNote( '#${data[datum].id}')" class ="my-2 px-5 ${currTheme} rounded">
                  <small class="self-end"> 
                    ${data[datum].date}
                  </small>
                <p style="display:block" id="${data[datum].id}">
                  ${data[datum].text}
                </p></li>`;
      logIDList.push(data[datum].id);
    }
  }
  $("#submitButton").removeAttribute("disabled");
}
function toggleNote(data) {
  disp = $(data).style.display;
  if (disp == "block") {
    hide($(data));
  } else {
    show($(data));
  }
}
async function sendIt() {
  let rn = new Date();
  let idToUse = createUUID();
  let text = $("#logInput").value;

  try {
    let response = await axios({
      method: "post",
      url: `/api/v1/logs?courseId=${courseSel}&uvuId=${stdID}&id=${idToUse}&courseId=${courseSel}&date=${rn.toLocaleString()}&text=${text}`,
      data: {
        courseId: courseSel,
        uvuId: stdID,
        date: rn.toLocaleString(),
        text: $("#logInput").value,
        id: idToUse,
      },
    });
    // console.log(response);
    getNotes(stdID);
  } catch (err) {
    console.log(err);
  }
}
