let completed = 0;
let pauseAudio = new Audio("./assets/pause.mp3");
let backwardAudio = new Audio("./assets/backward.mp3");

document.addEventListener("DOMContentLoaded", function () {
  let sessionLength = 25;
  let breakLength = 5;
  let isSession = true;
  let timeLeft = sessionLength * 60;
  let isPaused = true;

  function getFormattedTime() {
    let minute = Math.floor(timeLeft / 60),
      second = timeLeft - minute * 60;
    return minute + ":" + (second < 10 ? "0" : "") + second;
  }

  let fillAnimationSess = null,
    fillAnimationBreak = null;
  let intervalCounter = null;

  function updateSettingsTimeValues() {
    document.querySelector(".settings>.break>.value>.v").textContent =
      breakLength;
    document.querySelector(".settings>.session>.value>.v").textContent =
      sessionLength;
  }

  function pausePomodoro() {
    if (fillAnimationSess !== null) {
      fillAnimationSess.cancel();
    }

    if (fillAnimationBreak !== null) {
      fillAnimationBreak.cancel();
    }
    isPaused = true;
    clearInterval(intervalCounter);
    document.querySelector(".status").textContent = "Clique Para Começar";
  }

  function nextStep() {
    if (isSession) {
      timeLeft = breakLength * 60;
      document.querySelector(".fill.session").style.height = "100%";
      document.querySelector(".fill.break").style.height = "0%";
      fillAnimationBreak = document
        .querySelector(".fill.break")
        .animate([{ height: "0%" }, { height: "100%" }], {
          duration: timeLeft * 1000,
        });
      isSession = false;

      completed++;
      pauseAudio.play();
      document.querySelector(".completed").textContent = "";

      if (completed > 3) {
        timeLeft = 25 * 60;
        document.querySelector(".fullcicle").textContent = "🌳";
      } else {
        for (i = 0; i < completed; i++)
          document.querySelector(".completed").textContent += "🍅";
      }
    } else {
      document.querySelector(".fill.session").style.height = "0%";
      document.querySelector(".fill.break").style.height = "0%";

      backwardAudio.play();

      isSession = true;
      timeLeft = sessionLength * 60;

      fillAnimationSess = document
        .querySelector(".fill.session")
        .animate([{ height: "0%" }, { height: "100%" }], {
          duration: timeLeft * 1000,
        });
    }
  }

  function startPomodoro() {
    intervalCounter = setInterval(function () {
      if (timeLeft > 0) {
        timeLeft--;
        document.querySelector(".pomodoro>.time-left").textContent =
          getFormattedTime();
      } else nextStep();
    }, 1000);
    isPaused = false;
    isSession = !isSession;
    nextStep();
    document.querySelector(".status").textContent = "Clique Para Pausar";
  }

  document.querySelector(".pomodoro>.time-left").textContent =
    getFormattedTime();

  document
    .querySelector(".reset-pomodoro")
    .addEventListener("click", function () {
      pausePomodoro();
      isSession = !isSession;
      nextStep();
      document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();
    });

  document
    .querySelector(".next-pomodoro")
    .addEventListener("click", function () {
      pausePomodoro();
      isSession = !isSession;
      startPomodoro();
    });

  document.querySelector(".pomodoro").addEventListener("click", function () {
    if (isPaused) {
      startPomodoro();
    } else {
      pausePomodoro();
    }
  });

  document.querySelector(".control.is").addEventListener("click", function () {
    if (sessionLength < 100) {
      sessionLength++;
      pausePomodoro();
      if (isSession) {
        timeLeft = sessionLength * 60;
      } else {
        timeLeft = breakLength * 60;
      }
      document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();
      updateSettingsTimeValues();
    }
  });

  document.querySelector(".control.ds").addEventListener("click", function () {
    if (sessionLength > 1) {
      sessionLength--;
      pausePomodoro();
      if (isSession) {
        timeLeft = sessionLength * 60;
      } else {
        timeLeft = breakLength * 60;
      }
      document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();
      updateSettingsTimeValues();
    }
  });

  document.querySelector(".control.ib").addEventListener("click", function () {
    breakLength++;
    pausePomodoro();
    if (isSession) {
      timeLeft = sessionLength * 60;
    } else {
      timeLeft = breakLength * 60;
    }
    document.querySelector(".pomodoro>.time-left").textContent =
      getFormattedTime();
    updateSettingsTimeValues();
  });

  document.querySelector(".control.db").addEventListener("click", function () {
    if (breakLength > 1) {
      breakLength--;
      pausePomodoro();
      if (isSession) {
        timeLeft = sessionLength * 60;
      } else {
        timeLeft = breakLength * 60;
      }
      document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();
      updateSettingsTimeValues();
    }
  });

  //   TODO List
  
  function addTask() {
    const newTaskInput = document.getElementById("newTask");
    const taskText = newTaskInput.value.trim();

    if (taskText !== "") {
      const taskList = document.getElementById("taskList");
      const taskItem = document.createElement("li");
      taskItem.className = "todo-item";
      taskItem.innerHTML = `
        <div class="task-text">${taskText}</div>
        <div class="delete-task">X</div>
      `;

      taskList.appendChild(taskItem);

      // Limpa o campo de entrada
      newTaskInput.value = "";

      // Adiciona um evento de clique para excluir a tarefa
      const deleteButton = taskItem.querySelector(".delete-task");
      deleteButton.addEventListener("click", function () {
        taskList.removeChild(taskItem);
      });
    }
  }

  // Evento de clique para adicionar tarefa
  const addTaskButton = document.getElementById("addTask");
  addTaskButton.addEventListener("click", addTask);

  // Evento de pressionar Enter para adicionar tarefa
  document
    .getElementById("newTask")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        addTask();
      }
    });
});
