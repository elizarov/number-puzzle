import React, { Component } from 'react';
import './App.css';

const QUESTION = "Question: ";
const ANSWER = "Answer: ";
const CORRECT = "CORRECT!";

class App extends Component {
  constructor() {
    super();
    this.state = {
      question: 'SEND + MORE = MONEY',
      answer: '',
    };
  }

  handleQuestionChange = (event) => {
    this.setState({ question: event.target.value })
  };

  handleAnswerChange = (event) => {
    this.setState({ answer : event.target.value });
  };

  render() {
    const v = verdict(this.state.question, this.state.answer);
    return (
      <table>
        <tbody>
          <tr>
            <td>Question:</td>
            <td><input class={v.startsWith(QUESTION) ? "error" : ""}
                       size="50" type="text" value={this.state.question} onChange={this.handleQuestionChange}/></td>
          </tr>
          <tr>
            <td>Answer:</td>
            <td><input class={v.startsWith(ANSWER) ? "error" : ""}
                       size="50" type="text" value={this.state.answer} onChange={this.handleAnswerChange}/></td>
          </tr>
          <tr>
            <td>Verdict:</td>
            <td class={v === CORRECT ? "correct" : ""}>{v}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

function stripSpaces(s) {
  let t = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== ' ') t += s[i];
  }
  return t;
}

function parse(s, regex, desc) {
  const [l, r] = s.trim().split(/[ ]*=[ ]*/, 2);
  if (r === undefined) return "Missing `=`";
  const a = [...l.split(/[ ]*[+][ ]*/), r];
  for (let i = 0; i < a.length; i++) {
    a[i] = stripSpaces(a[i]);
    if (!regex.test(a[i])) return desc + ", but found '" + a[i] + "' in number #" + (i + 1);
  }
  return a;
}

function verdict(question, answer) {
  const qp = parse(question, /^[A-Z]+$/, "expected upper-case letters");
  if (typeof qp == "string") return QUESTION + qp;
  const ap = parse(answer, /^[1-9][0-9]*$/, "expected numbers");
  if (typeof ap == "string") return ANSWER + ap;
  if (ap.length !== qp.length) return ANSWER + "expected " + qp.length + " numbers";
  let sumL = 0;
  for (let i = 0; i < ap.length - 1; i++) {
    sumL += parseInt(ap[i]);
  }
  const sumR = parseInt(ap[ap.length - 1]);
  if (sumL !== sumR) return ANSWER + "the sum is not correct: " + sumL + " != " + sumR;
  const d = {};
  const l = {};
  for (let i = 0; i < qp.length; i++) {
    const q = qp[i];
    const a = ap[i];
    if (a.length !== q.length) return ANSWER + "incorrect length " + a.length + " != " + q.length + " in number #" + (i + 1);
    for (let j = 0; j < q.length; j++) {
      if (d[q[j]] !== undefined && d[q[j]] !== a[j])
        return ANSWER + "two digits '" + a[j] + "' and '" + d[q[j]] + "' used for the same letter '" + q[j] + "'";
      if (l[a[j]] !== undefined && l[a[j]] !== q[j])
        return ANSWER + "two letters '" + q[j] + "' and '" + l[a[j]] + "' used for the same digit '" + a[j] + "'";
      d[q[j]] = a[j];
      l[a[j]] = q[j];
    }
  }
  return CORRECT;
}

export default App;
