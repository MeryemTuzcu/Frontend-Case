const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");
const questionNumberElement = document.getElementById("question-number");

let shuffledQuestions, currentQuestionIndex, score, timer;

fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    const questions = data.slice(0, 10).map((post, index) => {
      const choices = post.body.split("\n").slice(0, 4);
      return {
        question: post.title,
        answers: [
          { text: choices[0], correct: true },
          { text: choices[1], correct: false },
          { text: choices[2], correct: false },
          { text: choices[3], correct: false }
        ]
      };
    });
    startQuiz(questions);
  });

function startQuiz(questions) {
  score = 0;
  questionContainer.style.display = "flex";
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  nextButton.classList.remove("hide");
  restartButton.classList.add("hide");
  resultDiv.classList.add("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  startTimer();
  questionNumberElement.innerText = `Question ${currentQuestionIndex + 1}`;
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "answer" + index;
    radio.name = "answer";
    radio.value = index;
    radio.disabled = true;

    const label = document.createElement("label");
    label.htmlFor = "answer" + index;
    label.innerText = answer.text;

    inputGroup.appendChild(radio);
    inputGroup.appendChild(label);
    answerButtons.appendChild(inputGroup);

    setTimeout(() => {
      radio.disabled = false; 
    }, 10000);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  clearInterval(timer);
}

function startTimer() {
  let timeLeft = 30; 
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      currentQuestionIndex++;
      if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
      } else {
        endQuiz();
      }
    } else {
      timeLeft--;
    }
  }, 10000);
}

nextButton.addEventListener("click", () => {
  const answerIndex = Array.from(
    answerButtons.querySelectorAll("input")
  ).findIndex((radio) => radio.checked);
  if (answerIndex !== -1) {
    if (shuffledQuestions[currentQuestionIndex].answers[answerIndex].correct) {
      score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      setNextQuestion();
    } else {
      endQuiz();
    }
  } else {
    alert("Please select an answer.");
  }
});

restartButton.addEventListener("click", () => {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
      const questions = data.slice(0, 10).map((post, index) => {
        const choices = post.body.split("\n").slice(0, 4);
        return {
          question: post.title,
          answers: [
            { text: choices[0], correct: false },
            { text: choices[1], correct: false },
            { text: choices[2], correct: false },
            { text: choices[3], correct: false }
          ]
        };
      });
      startQuiz(questions);
    });
});

function endQuiz() {
  questionContainer.style.display = "none";
  nextButton.classList.add("hide");
  restartButton.classList.remove("hide");
  resultDiv.classList.remove("hide");

  const table = document.createElement("table");
table.classList.add("result-table");
const headerRow = document.createElement("tr");
const questionHeader = document.createElement("th");
questionHeader.innerText = "Question";
headerRow.appendChild(questionHeader);
const answerHeader = document.createElement("th");
answerHeader.innerText = "Your Answer";
headerRow.appendChild(answerHeader);
const correctAnswerHeader = document.createElement("th");
correctAnswerHeader.innerText = "Correct Answer";
headerRow.appendChild(correctAnswerHeader);
table.appendChild(headerRow);


shuffledQuestions.forEach((question, index) => {
  const row = document.createElement("tr");
  const questionCell = document.createElement("td");
  questionCell.innerText = question.question;
  row.appendChild(questionCell);
  const answerIndex = Array.from(
    answerButtons.querySelectorAll("input")
  ).findIndex((radio) => radio.checked);
  const answerCell = document.createElement("td");
  answerCell.innerText = answerIndex !== -1 ? question.answers[answerIndex].text : "-";
  row.appendChild(answerCell);
  const correctAnswerCell = document.createElement("td");
  const correctAnswer = question.answers.find(answer => answer.correct);
  correctAnswerCell.innerText = correctAnswer.text;
  row.appendChild(correctAnswerCell);
  table.appendChild(row);
});

resultDiv.innerHTML = ""; 
resultDiv.appendChild(table);

resultDiv.innerHTML += `<p>Your final score: ${score} / ${shuffledQuestions.length}</p>`;
}
