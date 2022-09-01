// TODO: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html
var courseSel = "";
var courses = {};
var stat;
var stdID;
var logIDList = [];
function createUUID() {
  return "xxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
async function getCourses() {
  console.log("get Courses triggered");
  fetch("https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/courses")
    .then((response) => response.json())
    .then((data) => {
      for (datum in data) {
        document.getElementById(
          "course"
        ).innerHTML += `<option value=${data[datum].id}>${data[datum].display}</option>`;
      }
      courses = data;
    });
}
function peekABoo(data) {
  if (data != 0) {
    document.getElementById("restOfBody").style.display = "block";
    courseSel = courses[data].id;
  } else {
    document.getElementById("restOfBody").style.display = "none";
    courseSel = "";
  }
}

async function checkIt(data) {
  console.log(data);
  if (!isNaN(data)) {
    if (data > 9999999) {
      console.log("it be 8 char");
      document.getElementById(
        "uvuIdDisplay"
      ).innerText = `Student Logs for ${data}`;
      stdID = data;
      getNotes(data);
    }
  }
}
async function getNotes(id) {
  console.log("get notes triggered");
  fetch(
    `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${id}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(JSON.stringify(Response));
      for (datum in data) {
        let skip = false;
        for (ids in logIDList) {
          if (logIDList[ids] === data[datum].id) {
            skip = true;
            break;
          } else {
            console.log("add ");
          }
        }
        if (!skip) {
          document.getElementById(
            "logsList"
          ).innerHTML += `<li onclick="toggleIt( '${data[datum].id}')" class ="my-2 rounded bg-purple-100">
                  <small class="self-end"> 
                    ${data[datum].date}
                  </small>
                <p id="${data[datum].id}">
                  ${data[datum].text}
                </p></li>`;
          logIDList.push(data[datum].id);

          console.log(logIDList);
        }
      }
      document.getElementById("submitButton").removeAttribute("disabled");
    });
}
function toggleIt(data) {
  console.log(data);
  disp = document.getElementById(data).style.display;
  if (disp == "block") {
    console.log("at block");
    document.getElementById(data).style.display = "none";
  } else {
    document.getElementById(data).style.display = "block";
  }
}
async function sendIt() {
  let rn = new Date();
  let idToUse = createUUID();
  let text = document.getElementById("logInput").value;

  const data = {
    courseId: courseSel,
    uvuId: stdID,
    date: rn.toLocaleString(),
    text: document.getElementById("logInput").value,
    id: idToUse,
  };
  console.log(JSON.stringify(data));
  try {
    let response = await fetch(
      `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${stdID}&id=${idToUse}&courseId=${courseSel}&date=${rn.toLocaleString()}&text=${text}`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          id: `${idToUse}`,
          courseId: `${courseSel}`,
          uvuId: `${stdID}`,
          date: `${rn.toLocaleString()}`,
          text: `${text}`,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        getNotes(stdID);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (err) {
    console.log(err);
  }
}
