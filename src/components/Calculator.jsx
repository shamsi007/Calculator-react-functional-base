import React, { useState } from 'react'
import Buttons from './Buttons';
import Formula from './Formula';
import Output from './Output';
const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /\d[x/+‑]{1}‑$/
export default function Calculator() {
    const [currentVal,setcurrrentVal] = useState('0');
    const [prevVal,setprevVal] = useState('0');
    const [formula,setFormula] = useState('');
    const [currentSign,setcurrentSign] = useState('pos');
    const [lastClicked,setlastClicked] = useState('');
    const [evaluated,setEvaluated] = useState(false);
    const maxDigitWarning = () => {
        setcurrrentVal('Digit Limit Met');
        setprevVal(currentVal);
        setTimeout(() => setcurrrentVal(prevVal), 1000);
    }
    const handleEvaluate = () => {
        if (!currentVal.includes('Limit')) {
          let expression = formula;
          while (endsWithOperator.test(expression)) {
            expression = expression.slice(0, -1);
          }
          expression = expression
            .replace(/x/g, '*')
            .replace(/‑/g, '-')
            .replace('--', '+0+0+0+0+0+0+');
          let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
          setcurrrentVal(answer.toString());
          setFormula(expression
            .replace(/\*/g, '⋅')
            .replace(/-/g, '‑')
            .replace('+0+0+0+0+0+0+', '‑-')
            .replace(/(x|\/|\+)‑/, '$1-')
            .replace(/^‑/, '-') +
          '=' +
          answer);
          setprevVal(answer);
          setEvaluated(true);
        }
    }
    const handleOperators= (e) => {
        if (!currentVal.includes('Limit')) {
          const value = e.target.value;
          setcurrrentVal(value);
          setEvaluated(false);
          if (evaluated) {
            setFormula(prevVal + value);
          } else if (!endsWithOperator.test(formula)) {
            setprevVal(formula);
            setFormula(formula + value);
          } else if (!endsWithNegativeSign.test(formula)) {
            setFormula((endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value);
          } else if (value !== '‑') {
            setFormula(prevVal + value);
          }
        }
    }
    const handleNumbers = (e) => {
        if (!currentVal.includes('Limit')) {
          const value = e.target.value;
          setEvaluated(false);
          if (currentVal.length > 21) {
            this.maxDigitWarning();
          } else if (evaluated) {
            setcurrrentVal(value);
            setFormula(value !== '0' ? value : '');
          } else {
            setcurrrentVal(currentVal === '0' || isOperator.test(currentVal)
            ? value
            : currentVal + value);
            setFormula(currentVal === '0' && value === '0'
            ? formula === ''
              ? value
              : formula
            : /([^.0-9]0|^0)$/.test(formula)
            ? formula.slice(0, -1) + value
            : formula + value);
          }
        }
    }
    const handleDecimal = () => {
        if (evaluated === true) {
            setcurrrentVal('0');
            setFormula('0.')
            setEvaluated(false);
        } else if (
          !currentVal.includes('.') &&
          !currentVal.includes('Limit')
        ) {
            setEvaluated(false);
          if (currentVal.length > 21) {
            maxDigitWarning();
          } else if (
            endsWithOperator.test(formula) ||
            (currentVal === '0' && formula === '')
          ) {
            setcurrrentVal('0.');
            setFormula(formula + '0.');
          } else {
            setcurrrentVal(formula.match(/(-?\d+\.?\d*)$/)[0] + '.');
            setFormula(formula + '.');
          }
        }
    }
    const initialize = () => {
        setcurrrentVal('0');
        setprevVal('0');
        setFormula('');
        setcurrentSign('pos');
        setlastClicked('');
        setEvaluated(false);
    }
    return (
        <div>
          <div className="calculator">
            <Formula formula={formula.replace(/x/g, '⋅')} />
            <Output currentValue={currentVal} />
            <Buttons
              decimal={handleDecimal}
              evaluate={handleEvaluate}
              initialize={initialize}
              numbers={handleNumbers}
              operators={handleOperators}
            />
          </div>
        </div>
    )
}
