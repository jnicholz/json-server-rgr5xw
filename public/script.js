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
  response = await axios("/api/v1/courses");
  for (datum in response.data) {
    $(
      "#course"
    ).innerHTML += `<option value=${response.data[datum].id}>${response.data[datum].display}</option>`;
  }
  courses = response.data;
}

function peekABoo(data) {
  let form = $("#restOfBody");
  if (data != 0) {
    show(form);
    // $("#restOfBody").style.display = "block";
    courseSel = courses[data].id;
  } else {
    hide(form);
    // $("#restOfBody").style.display = "none";
    courseSel = "";
  }
}

async function checkIt(data) {
  console.log(data);
  if (!isNaN(data)) {
    if (data > 9999999) {
      console.log("it be 8 char");
      $("#uvuIdDisplay").innerText = `Student Logs for ${data}`;
      stdID = data;
      getNotes(data);
    }
  }
}
async function getNotes(id) {
  console.log("get notes triggered");
  let response = await axios({
    method: "get",
    url: `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${id}`,
  });
  let data = response.data;
  // console.log(response.data);
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
      $(
        "#logsList"
      ).innerHTML += `<li onclick="toggleIt( '#${data[datum].id}')" class ="my-2 rounded bg-purple-100">
                  <small class="self-end"> 
                    ${data[datum].date}
                  </small>
                <p style="display:block" id="${data[datum].id}">
                  ${data[datum].text}
                </p></li>`;
      logIDList.push(data[datum].id);

      console.log(logIDList);
    }
  }
  $("#submitButton").removeAttribute("disabled");
}
function toggleIt(data) {
  console.log(data);
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
      url: `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${stdID}&id=${idToUse}&courseId=${courseSel}&date=${rn.toLocaleString()}&text=${text}`,
      data: {
        courseId: courseSel,
        uvuId: stdID,
        date: rn.toLocaleString(),
        text: $("#logInput").value,
        id: idToUse,
      },
    });
    console.log(response);
    getNotes(stdID);
  } catch (err) {
    console.log(err);
  }
}
